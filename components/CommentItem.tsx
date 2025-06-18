import { CardComment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface CommentItemProps {
  comment: CardComment;
}

interface CommentAuthor {
  username?: string;
  avatar_url?: string;
  email?: string;
}

export function CommentItem({ comment }: CommentItemProps) {
  const [author, setAuthor] = useState<CommentAuthor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      const supabase = createClient();
      setIsLoading(true);

      try {
        // Fetch author's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', comment.user_id)
          .single();
          
        // Get author's email as fallback
        const { data: { user } } = await supabase.auth.admin.getUserById(comment.user_id);
        
        setAuthor({
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          email: user?.email
        });
      } catch (error) {
        console.error('Error fetching comment author:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [comment.user_id]);

  if (isLoading) {
    return (
      <div className="py-3 text-sm border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 text-sm border-t border-gray-200">
      <div className="flex items-start gap-3">
        {author?.avatar_url ? (
          <img 
            src={author.avatar_url} 
            alt="Author's avatar"
            className="w-6 h-6 rounded-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">
              {(author?.username || author?.email || '?')[0].toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-700">{author?.username || author?.email || 'Anonymous'}</span>
            {/* <time className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </time> */}
          </div>
          <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}