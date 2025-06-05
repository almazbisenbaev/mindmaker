
## Initial run to create profiles table with usernames and profile pics

```
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;

-- Create policy to allow authenticated users to view their own profile
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy to allow authenticated users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

```

### a database function to automatically create a profile when a user signs up

```
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

```


## RLS policies for 'avatars' bucket

```
-- Allow users to upload avatar files to their own folder
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

```

## Create documents, cards and comments

```
-- Create documents table
create table documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  template text not null,
  title text not null,
  status text check (status in ('public', 'private')) not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create cards table
create table cards (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents on delete cascade not null,
  column_id text not null,
  content text not null,
  position integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create comments table
create table comments (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid references cards on delete cascade not null,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table documents enable row level security;
alter table cards enable row level security;
alter table comments enable row level security;

```

### RLS for documents, cards and comments

```
-- Documents policies
create policy "Users can create their own documents"
on documents for insert
with check (auth.uid() = user_id);

create policy "Users can update their own documents"
on documents for update
using (auth.uid() = user_id);

create policy "Users can delete their own documents"
on documents for delete
using (auth.uid() = user_id);

create policy "Everyone can view public documents"
on documents for select
using (status = 'public' or auth.uid() = user_id);

-- Cards policies
create policy "Users can manage cards on their documents"
on cards for all
using (
  auth.uid() = (
    select user_id 
    from documents 
    where id = document_id
  )
);

create policy "Everyone can view cards on public documents"
on cards for select
using (
  exists (
    select 1 
    from documents 
    where id = document_id 
    and (status = 'public' or user_id = auth.uid())
  )
);

-- Comments policies
create policy "Users can create comments"
on comments for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
on comments for delete
using (auth.uid() = user_id);

create policy "Everyone can view comments on public documents"
on comments for select
using (
  exists (
    select 1 
    from documents d
    join cards c on c.document_id = d.id
    where c.id = card_id 
    and (d.status = 'public' or d.user_id = auth.uid())
  )
);

```


## Create blog posts table

```
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

```