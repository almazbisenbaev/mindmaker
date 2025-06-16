import { CardComment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

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

  useEffect(() => {
    const fetchAuthor = async () => {
      const supabase = createClient();

      // Fetch author's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', comment.user_id)
        .single();
        
      // Get author's email as fallback
      const { data: { user } } = await supabase.auth.getUser(comment.user_id);
      
      setAuthor({
        username: profile?.username,
        avatar_url: profile?.avatar_url,
        email: user?.email
      });
    };

    fetchAuthor();
  }, [comment.user_id]);

  return (
    <div className="py-3 text-sm border-t border-gray-200">
      <div className="flex items-start gap-3">
        {author?.avatar_url ? (
          <img 
            src={author.avatar_url} 
            alt="Author's avatar"
            className="w-6 h-6 rounded-full object-cover"
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