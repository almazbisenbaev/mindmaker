import { useState, useEffect } from 'react';
import { Card, CardComment } from '@/types';
import { CommentItem } from './CommentItem';
import { CreateCommentForm } from './CreateCommentForm';
import { Button } from './ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface CardItemProps {
  card: Card;
  comments: CardComment[];
  onCommentsUpdated: () => Promise<void>;
}

export function CardItem({ card, comments, onCommentsUpdated }: CardItemProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const cardComments = comments.filter(c => c.card_id === card.id);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user state
    supabase.auth.getUser().then(({ data: { user }}) => {
      setUser(user);
    });

    // Listen for auth state changes
    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="p-3 bg-white rounded shadow">
      <div className="whitespace-pre-wrap">{card.content}</div>
      
      {cardComments.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Comments ({cardComments.length})
          </h4>
          <div className="space-y-1.5">
            {cardComments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}

      {!isAddingComment ? (
        user ? (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-muted-foreground"
            onClick={() => setIsAddingComment(true)}
          >
            <MessageSquarePlus className="h-4 w-4 mr-1" />
            Add Comment
          </Button>
        ) : cardComments.length === 0 ? (
          <div className="mt-3 text-sm text-gray-600">
            <Link href="/sign-in" className="text-primary hover:underline">Sign in</Link> to leave a comment.
          </div>
        ) : null
      ) : (
        <CreateCommentForm
          cardId={card.id}
          onCommentCreated={onCommentsUpdated}
          onCancel={() => setIsAddingComment(false)}
        />
      )}
    </div>
  );
}