
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