'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'

export default function BlogPostForm() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
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
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[200px]"
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
        <Label htmlFor="featuredImage">Featured Image URL</Label>
        <Input
          id="featuredImage"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </Button>
    </form>
  )
}
