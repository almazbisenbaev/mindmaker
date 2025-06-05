-- Create blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  reading_time INTEGER, -- in minutes
  tags TEXT[]
);

-- Create role table
CREATE TABLE roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role_id UUID REFERENCES roles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Create admin role
INSERT INTO roles (name, description) VALUES 
('admin', 'Full access to blog management'),
('editor', 'Can create and edit posts but needs admin approval');

-- Create RLS policies
-- Only admins can create posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can create posts" ON blog_posts
  FOR INSERT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = 'admin' AND ur.user_id = auth.uid()
  ));

-- Only admins can update posts
CREATE POLICY "Admins can update posts" ON blog_posts
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = 'admin' AND ur.user_id = auth.uid()
  ));

-- Only admins can delete posts
CREATE POLICY "Admins can delete posts" ON blog_posts
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = 'admin' AND ur.user_id = auth.uid()
  ));

-- Everyone can view published posts
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT TO authenticated, anon
  USING (is_published = TRUE);

-- Admins can view all posts
CREATE POLICY "Admins can view all posts" ON blog_posts
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = 'admin' AND ur.user_id = auth.uid()
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
