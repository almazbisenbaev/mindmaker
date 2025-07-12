-- Create blog-files storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-files', 'blog-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-files bucket
CREATE POLICY "Blog images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'blog-files' );

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT 
  WITH CHECK ( bucket_id = 'blog-files' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'blog-files' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'blog-files' AND auth.role() = 'authenticated' ); 