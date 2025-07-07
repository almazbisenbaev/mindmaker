import { useState, useEffect } from 'react';
import { Card, CardComment } from '@/types';
import { CommentItem } from './CommentItem';
import { CreateCommentForm } from './CreateCommentForm';
import { Button } from './ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useDocumentContext } from '@/app/doc/[id]/DocumentContext';

interface CardItemProps {
  card: Card;
  isExporting?: boolean;
}

export function CardItem({ card, isExporting = false }: CardItemProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { comments, handleCommentsUpdated } = useDocumentContext();
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
    <div className="p-5 bg-white rounded-xl relative shadow-[0px_6px_11px_-2px_rgba(0,_0,_0,_0.1)]">
      <div className="whitespace-pre-wrap text-lg">{card.content}</div>
      
      {cardComments.length > 0 && (
        <div className="mt-3 space-y-2">
          {/* <h4 className="text-sm font-medium text-gray-700">
            Comments ({cardComments.length})
          </h4> */}
          <div className="space-y-1.5">
            {cardComments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}

      {!isExporting && !isAddingComment ? (
        user ? (
          <Button
            variant="outline"
            size="sm"
            className="mt-6 w-full"
            onClick={() => setIsAddingComment(true)}
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Add comment
          </Button>
        ) : cardComments.length === 0 ? (
          <>
          {/* // <div className="mt-3 text-sm text-gray-600">
          //   <Link href="/sign-in" className="text-primary hover:underline">Sign in</Link> to leave a comment.
          // </div> */}
          </>
        ) : null
      ) : !isExporting && (
        <CreateCommentForm
          cardId={card.id}
          onCommentCreated={handleCommentsUpdated}
          onCancel={() => setIsAddingComment(false)}
        />
      )}
    </div>
  );
}