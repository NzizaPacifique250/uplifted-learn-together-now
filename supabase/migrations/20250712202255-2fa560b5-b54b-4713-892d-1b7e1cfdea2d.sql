-- Create study groups table
CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  created_by UUID NOT NULL,
  member_limit INTEGER DEFAULT 20,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group memberships table
CREATE TABLE public.group_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group messages table
CREATE TABLE public.group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.group_memberships 
ADD CONSTRAINT group_memberships_group_id_fkey 
FOREIGN KEY (group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_messages 
ADD CONSTRAINT group_messages_group_id_fkey 
FOREIGN KEY (group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for study_groups
CREATE POLICY "Anyone can view public study groups" 
ON public.study_groups 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create study groups" 
ON public.study_groups 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" 
ON public.study_groups 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups" 
ON public.study_groups 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create RLS policies for group_memberships
CREATE POLICY "Users can view memberships of groups they belong to" 
ON public.group_memberships 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_memberships gm 
    WHERE gm.group_id = group_memberships.group_id 
    AND gm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join public groups" 
ON public.group_memberships 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.study_groups sg 
    WHERE sg.id = group_id AND sg.is_public = true
  )
);

CREATE POLICY "Users can leave groups they are members of" 
ON public.group_memberships 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for group_messages
CREATE POLICY "Group members can view messages" 
ON public.group_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_memberships gm 
    WHERE gm.group_id = group_messages.group_id 
    AND gm.user_id = auth.uid()
  )
);

CREATE POLICY "Group members can send messages" 
ON public.group_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.group_memberships gm 
    WHERE gm.group_id = group_messages.group_id 
    AND gm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.group_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.group_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_study_groups_updated_at
BEFORE UPDATE ON public.study_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_messages_updated_at
BEFORE UPDATE ON public.group_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get member count for study groups
CREATE OR REPLACE FUNCTION public.get_group_member_count(group_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.group_memberships
  WHERE group_memberships.group_id = get_group_member_count.group_id;
$$;