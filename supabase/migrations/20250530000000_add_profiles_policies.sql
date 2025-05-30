-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT 
  WITH CHECK ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );
