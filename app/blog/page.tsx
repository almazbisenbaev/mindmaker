'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { BlogPost } from '@/types/blog'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

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

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <div className="space-y-8">
        {posts?.map((post) => (
          <article key={post.id} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                <a href={`/blog/${post.slug}`} className="hover:text-primary">
                  {post.title}
                </a>
              </h2>
              {post.excerpt && <div className="text-gray-600"><ReactMarkdown>{post.excerpt}</ReactMarkdown></div>}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString()}
                </time>
                {post.reading_time && (
                  <span>
                    • {post.reading_time} min read
                  </span>
                )}
                {!post.is_published && (
                  <span className="text-orange-600">
                    • Draft
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  )
}
