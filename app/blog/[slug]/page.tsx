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
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user state
    supabase.auth.getUser().then(({ data: { user }}) => {
      setUser(user)
      if (user) {
        fetchUserRoles(user.id)
      }
    })

    // Listen for auth state changes
    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchUserRoles(session.user.id)
      } else {
        setUserRoles([])
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserRoles = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles (
            name
          )
        `)
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user roles:', error)
        return
      }

      const roles = data?.map((item: any) => item.roles.name) || []
      setUserRoles(roles)
    } catch (error) {
      console.error('Error fetching user roles:', error)
    }
  }

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

  const handleDelete = async () => {
    if (!post || !user || !userRoles.includes('admin') && !userRoles.includes('editor')) return

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = createClient()

      // Delete featured image from storage if it exists
      if (post.featured_image) {
        try {
          // Extract the file path from the URL
          const url = new URL(post.featured_image)
          const filePath = url.pathname.split('/').pop() // Get the filename
          
          if (filePath) {
            const { error: storageError } = await supabase.storage
              .from('blog-files')
              .remove([filePath])

            if (storageError) {
              console.error('Error deleting featured image:', storageError)
              // Continue with post deletion even if image deletion fails
            }
          }
        } catch (error) {
          console.error('Error processing featured image deletion:', error)
        }
      }

      // Delete the post
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id)

      if (error) throw error

      toast.success('Post deleted successfully!')
      router.push('/blog')
    } catch (error) {
      console.error('Error deleting post:', error)
      setError('Failed to delete post')
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const canManagePost = user && (userRoles.includes('admin') || userRoles.includes('editor'))

  if (isLoading) return <div>Loading...</div>
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
        <div className="flex items-center gap-4 mb-6">
          <h1>{post.title}</h1>
          {!post.is_published && (
            <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
              Draft
            </span>
          )}
        </div>
        {post.meta_description && (
          <p className="text-gray-600 mt-2 mb-6">{post.meta_description}</p>
        )}
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>

      {canManagePost && (
        <div className="mt-8 flex gap-4">
          {!post.is_published && (
            <Button onClick={handlePublish}>
              Publish Post
            </Button>
          )}
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </Button>
        </div>
      )}
    </div>
  )
}
