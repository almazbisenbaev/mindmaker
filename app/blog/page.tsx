'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { BlogPost } from '@/types/blog'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { Calendar, Clock, EyeOff, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [userRoles, setUserRoles] = useState<string[]>([])

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
    const fetchPosts = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data || [])
      }
      setIsLoading(false)
    }

    fetchPosts()
  }, [])

  const canManagePosts = user && (userRoles.includes('admin') || userRoles.includes('editor'))

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            {canManagePosts && (
              <Link href="/blog/new">
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Post
                </Button>
              </Link>
            )}
          </div>
          <p className="text-gray-600">Thoughts, ideas, and insights.</p>
        </div>

        {/* Posts */}
        <div className="space-y-12">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="group">
                {/* Featured Image */}
                {post.featured_image && (
                  <div className="mb-6">
                    <Link href={`/blog/${post.slug}`}>
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  </div>
                )}

                {/* Content */}
                <div>
                  {/* Status Badge */}
                  {!post.is_published && (
                    <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium mb-4">
                      <EyeOff className="w-3 h-3" />
                      Draft
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.reading_time} min read</span>
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <div className="text-gray-600 mb-4 leading-relaxed">
                      <ReactMarkdown>{post.excerpt}</ReactMarkdown>
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
