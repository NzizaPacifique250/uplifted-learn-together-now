-- Create user_roles table for system-wide admin permissions
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = has_role.user_id
    AND ur.role = has_role.role_name
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create join_requests table
CREATE TABLE public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for join_requests
CREATE POLICY "Users can create their own join requests" 
ON public.join_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own join requests" 
ON public.join_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Group admins can view requests for their groups" 
ON public.join_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_memberships gm
    WHERE gm.group_id = join_requests.group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);

CREATE POLICY "Group admins can update requests for their groups" 
ON public.join_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.group_memberships gm
    WHERE gm.group_id = join_requests.group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);

-- Update study groups policies to restrict creation to admins
DROP POLICY IF EXISTS "Users can create study groups" ON public.study_groups;
CREATE POLICY "Admins can create study groups" 
ON public.study_groups 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND 
  public.has_role(auth.uid(), 'admin')
);

-- Update group memberships policy to prevent direct joining
DROP POLICY IF EXISTS "Users can join public groups" ON public.group_memberships;
CREATE POLICY "System can create approved memberships" 
ON public.group_memberships 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  (
    -- Allow if user is group creator (admin role)
    EXISTS (
      SELECT 1 FROM public.study_groups sg
      WHERE sg.id = group_memberships.group_id
      AND sg.created_by = auth.uid()
    )
    OR
    -- Allow if there's an approved join request
    EXISTS (
      SELECT 1 FROM public.join_requests jr
      WHERE jr.group_id = group_memberships.group_id
      AND jr.user_id = auth.uid()
      AND jr.status = 'approved'
    )
  )
);

-- Enable realtime for join_requests
ALTER TABLE public.join_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.join_requests;