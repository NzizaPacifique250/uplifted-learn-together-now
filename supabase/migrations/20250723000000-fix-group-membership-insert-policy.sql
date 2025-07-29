-- Fix group_memberships INSERT policy to allow admins to approve join requests
-- Drop the current restrictive policy
DROP POLICY IF EXISTS "System can create approved memberships" ON public.group_memberships;

-- Create a new policy that allows:
-- 1. Users to join groups they created (admin role)
-- 2. Users to join groups where they have an approved join request
-- 3. Group admins to add users who have approved join requests
CREATE POLICY "Allow approved memberships" 
ON public.group_memberships 
FOR INSERT 
WITH CHECK (
  (
    -- Allow if user is group creator (admin role)
    EXISTS (
      SELECT 1 FROM public.study_groups sg
      WHERE sg.id = group_memberships.group_id
      AND sg.created_by = auth.uid()
    )
    OR
    -- Allow if there's an approved join request for the user being added
    EXISTS (
      SELECT 1 FROM public.join_requests jr
      WHERE jr.group_id = group_memberships.group_id
      AND jr.user_id = group_memberships.user_id
      AND jr.status = 'approved'
    )
    OR
    -- Allow if current user is a group admin and there's an approved join request
    EXISTS (
      SELECT 1 FROM public.group_memberships gm
      WHERE gm.group_id = group_memberships.group_id
      AND gm.user_id = auth.uid()
      AND gm.role = 'admin'
      AND EXISTS (
        SELECT 1 FROM public.join_requests jr
        WHERE jr.group_id = group_memberships.group_id
        AND jr.user_id = group_memberships.user_id
        AND jr.status = 'approved'
      )
    )
  )
); 