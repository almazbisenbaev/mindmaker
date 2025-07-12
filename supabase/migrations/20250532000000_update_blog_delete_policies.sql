-- Drop the existing admin-only delete policy
DROP POLICY IF EXISTS "Admins can delete posts" ON blog_posts;

-- Create new policy that allows both admins and editors to delete posts
CREATE POLICY "Admins and editors can delete posts" ON blog_posts
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE (r.name = 'admin' OR r.name = 'editor') AND ur.user_id = auth.uid()
  ));

-- Also update the create and update policies to allow editors
DROP POLICY IF EXISTS "Admins can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update posts" ON blog_posts;

CREATE POLICY "Admins and editors can create posts" ON blog_posts
  FOR INSERT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE (r.name = 'admin' OR r.name = 'editor') AND ur.user_id = auth.uid()
  ));

CREATE POLICY "Admins and editors can update posts" ON blog_posts
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE (r.name = 'admin' OR r.name = 'editor') AND ur.user_id = auth.uid()
  ));

-- Update the view policy to allow editors to view all posts too
DROP POLICY IF EXISTS "Admins can view all posts" ON blog_posts;

CREATE POLICY "Admins and editors can view all posts" ON blog_posts
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE (r.name = 'admin' OR r.name = 'editor') AND ur.user_id = auth.uid()
  )); 