import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('title, meta_title, meta_description, featured_image')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching latest post:', error)
    return {
      title: 'Mindmaker Blog',
      description: 'Latest insights and updates from Mindmaker',
      openGraph: {
        title: 'Mindmaker Blog',
        description: 'Latest insights and updates from Mindmaker',
      },
    }
  }

  const latestPost = posts?.[0]
  
  return {
    title: latestPost?.meta_title || 'Mindmaker Blog',
    description: latestPost?.meta_description || 'Latest insights and updates from Mindmaker',
    openGraph: {
      title: latestPost?.meta_title || 'Mindmaker Blog',
      description: latestPost?.meta_description || 'Latest insights and updates from Mindmaker',
      images: latestPost?.featured_image ? [{ url: latestPost.featured_image }] : undefined,
    },
  }
}
