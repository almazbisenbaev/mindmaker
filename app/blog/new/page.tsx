'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export default function BlogPostForm() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const contentRef = useRef('')
  const [excerpt, setExcerpt] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user state
    supabase.auth.getUser().then(({ data: { user }}) => {
      setUser(user)
      setIsLoading(false)
    }).catch(error => {
      console.error('Error getting user:', error)
      setIsLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setIsLoading(false) // Also set loading to false when auth state changes
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const slug = generateSlug(title)

      const content = contentRef.current

      console.log('Attempting to create post with slug:', slug)
      console.log('Form data:', {
        title,
        content,
        excerpt,
        featuredImage,
        user_id: user?.id
      })

      try {
        // Check if slug exists
        const { data: posts, error: existingError } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', slug)
          .limit(1)

        if (existingError) {
          console.error('Slug check error:', JSON.stringify(existingError, null, 2))
          throw new Error('Error checking slug: ' + JSON.stringify(existingError, null, 2))
        }

        if (posts && posts.length > 0) {
          // Slug exists
          throw new Error('Slug already exists')
        }

        // If we got here, slug doesn't exist, proceed with creation
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title,
            content,
            excerpt,
            featured_image: featuredImage,
            slug,
            author_id: user.id,
            is_published: false
          })

        if (error) {
          console.error('Insert error:', JSON.stringify(error, null, 2))
          throw new Error('Error creating post: ' + JSON.stringify(error, null, 2))
        }
        console.log('Post created successfully:', data)
        toast.success('Blog post created successfully!')
        router.push('/blog')
      } catch (error) {
        console.error('Error in try block:', JSON.stringify(error, null, 2))
        if (error instanceof Error) {
          setError(error.message)
          toast.error(error.message)
        }
        throw error
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
      if (error instanceof Error) {
        setError(error.message)
        toast.error(error.message)
      }
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFeaturedImageUpload = async (file: File) => {
    const supabase = createClient()
    const fileName = `featured/${Date.now()}_${file.name}`
    
    console.log('Attempting to upload featured image:', {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      bucket: 'blog-files'
    })
    
    const { data, error } = await supabase.storage.from('blog-files').upload(fileName, file)
    
    if (error) {
      console.error('Featured image upload error:', {
        error,
        errorMessage: error.message
      })
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    console.log('Featured image uploaded successfully:', data)
    const { data: { publicUrl } } = supabase.storage.from('blog-files').getPublicUrl(fileName)
    console.log('Generated public URL:', publicUrl)
    setFeaturedImage(publicUrl)
  }

  const handleImageUpload = async (file: File) => {
    const supabase = createClient()
    const fileName = `content/${Date.now()}_${file.name}`
    
    console.log('Attempting to upload content image:', {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      bucket: 'blog-files'
    })
    
    const { data, error } = await supabase.storage.from('blog-files').upload(fileName, file)
    
    if (error) {
      console.error('Content image upload error:', {
        error,
        errorMessage: error.message
      })
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    console.log('Content image uploaded successfully:', data)
    const { data: { publicUrl } } = supabase.storage.from('blog-files').getPublicUrl(fileName)
    console.log('Generated public URL:', publicUrl)
    return publicUrl
  }

  // Memoize image upload handler for useMemo
  const handleImageUploadCallback = useCallback(async (
    file: File,
    onSuccess: (url: string) => void,
    onError: (msg: string) => void
  ) => {
    try {
      const url = await handleImageUpload(file)
      onSuccess(url)
    } catch (e) {
      toast.error('Image upload failed')
      onError('Image upload failed')
    }
  }, [handleImageUpload, toast])

  const simpleMdeOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: 'Write your post in markdown... You can insert images using the toolbar.',
    uploadImage: true,
    imageUploadFunction: handleImageUploadCallback,
  }), [handleImageUploadCallback])

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Please sign in to create a post</h2>
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <SimpleMDE
          id="content"
          onChange={value => { contentRef.current = value; }}
          options={simpleMdeOptions}
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="featuredImage">Featured Image</Label>
        <input
          id="featuredImage"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (file) {
              setFeaturedImageFile(file)
              try {
                await handleFeaturedImageUpload(file)
                toast.success('Featured image uploaded!')
              } catch (err) {
                console.error('Featured image upload failed:', err)
                const errorMessage = err instanceof Error ? err.message : 'Failed to upload featured image'
                toast.error(errorMessage)
              }
            }
          }}
        />
        {featuredImage && (
          <img src={featuredImage} alt="Featured" className="mt-2 max-h-40 rounded" />
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </Button>
    </form>
  )
}
