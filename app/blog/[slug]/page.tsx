'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from "next/navigation";
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { BlogPost } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default function BlogPostPage() {

  const params = useParams();

  const slug = params.slug;
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user state
    supabase.auth.getUser().then(({ data: { user }}) => {
      setUser(user)
    })

    // Listen for auth state changes
    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        setError(error.message)
        return
      }
      setPost(data)
      setError(null)
    } catch (error) {
      setError('Failed to load post')
      console.error('Error fetching post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!post || !user) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('blog_posts')
        .update({
          is_published: true,
          published_at: new Date().toISOString()
        })
        .eq('id', post.id)

      if (error) throw error
      toast.success('Post published successfully!')
      await fetchPost()
    } catch (error) {
      console.error('Error publishing post:', error)
      setError('Failed to publish post')
      toast.error('Failed to publish post')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Please sign in to view this post</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!post) return <div>Post not found</div>

  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose prose-lg">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded mb-6"
          />
        )}
        <h1>{post.title}</h1>
        {post.meta_description && (
          <p className="text-gray-600 mt-2 mb-6">{post.meta_description}</p>
        )}
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>

      {user && (
        <div className="mt-8">
          {!post.is_published && (
            <Button onClick={handlePublish}>
              Publish Post
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
