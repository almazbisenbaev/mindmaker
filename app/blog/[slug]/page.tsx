'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from "next/navigation";
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { BlogPost } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Calendar, Clock, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleStatusChange = async (newStatus: string) => {
    if (!post || !user) return

    setIsUpdating(true)
    try {
      const supabase = createClient()
      const updateData = {
        is_published: newStatus === 'published',
        published_at: newStatus === 'published' ? new Date().toISOString() : null
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', post.id)

      if (error) throw error
      
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
      await fetchPost()
    } catch (error) {
      console.error('Error updating post status:', error)
      toast.error('Failed to update post status')
    } finally {
      setIsUpdating(false)
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
          // Extract the file path from the Supabase storage URL
          // URL format: https://project.supabase.co/storage/v1/object/public/blog-files/featured/1234567890_filename.jpg
          const url = new URL(post.featured_image)
          const pathSegments = url.pathname.split('/')
          
          // Find the index of 'blog-files' in the path
          const blogFilesIndex = pathSegments.findIndex(segment => segment === 'blog-files')
          
          if (blogFilesIndex !== -1 && blogFilesIndex + 1 < pathSegments.length) {
            // Extract everything after 'blog-files/' including the folder structure
            const filePath = pathSegments.slice(blogFilesIndex + 1).join('/')
            
            console.log('Attempting to delete featured image:', filePath)
            
            const { error: storageError } = await supabase.storage
              .from('blog-files')
              .remove([filePath])

            if (storageError) {
              console.error('Error deleting featured image:', storageError)
              // Continue with post deletion even if image deletion fails
            } else {
              console.log('Successfully deleted featured image:', filePath)
            }
          } else {
            console.warn('Could not extract file path from URL:', post.featured_image)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-900 text-xl mb-4">Error loading post</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/blog" className="text-gray-900 hover:text-gray-600">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-900 text-xl mb-4">Post not found</div>
          <Link href="/blog" className="text-gray-900 hover:text-gray-600">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Admin Controls */}
        {canManagePost && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <Select 
                    value={post.is_published ? 'published' : 'draft'} 
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <article>
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Status Badge */}
          {!post.is_published && (
            <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium mb-6">
              <EyeOff className="w-3 h-3" />
              Draft
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-8">
            {post.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            )}
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
            {post.created_at && !post.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            )}
          </div>

          {/* Meta Description */}
          {post.meta_description && (
            <div className="mb-8">
              <p className="text-gray-600 text-lg leading-relaxed">
                {post.meta_description}
              </p>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-12 prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg prose-ul:my-6 prose-ol:my-6 prose-li:text-gray-700 prose-li:mb-2 prose-code:text-sm prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-hr:my-8 prose-hr:border-gray-200">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
