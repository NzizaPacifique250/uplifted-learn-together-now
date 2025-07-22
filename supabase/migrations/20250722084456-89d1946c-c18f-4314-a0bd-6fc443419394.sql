-- Fix infinite recursion in group_memberships RLS policy
-- Create security definer function to check group membership
CREATE OR REPLACE FUNCTION public.is_group_member(group_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_memberships gm 
    WHERE gm.group_id = is_group_member.group_id 
    AND gm.user_id = is_group_member.user_id
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop the problematic policy and create a new one
DROP POLICY IF EXISTS "Users can view memberships of groups they belong to" ON public.group_memberships;

CREATE POLICY "Users can view memberships of groups they belong to" 
ON public.group_memberships 
FOR SELECT 
USING (public.is_group_member(group_id, auth.uid()));

-- Also update the group_messages policy to use the function
DROP POLICY IF EXISTS "Group members can view messages" ON public.group_messages;
DROP POLICY IF EXISTS "Group members can send messages" ON public.group_messages;

CREATE POLICY "Group members can view messages" 
ON public.group_messages 
FOR SELECT 
USING (public.is_group_member(group_id, auth.uid()));

CREATE POLICY "Group members can send messages" 
ON public.group_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  public.is_group_member(group_id, auth.uid())
);

-- Enable realtime for group messages
ALTER TABLE public.group_messages REPLICA IDENTITY FULL;
ALTER TABLE public.group_memberships REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_memberships;