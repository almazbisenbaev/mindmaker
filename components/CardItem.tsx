import { useState } from 'react';
import { Card, CardComment } from '@/types';
import { CommentItem } from './CommentItem';
import { CreateCommentForm } from './CreateCommentForm';
import { Button } from './ui/button';
import { MessageSquarePlus } from 'lucide-react';

interface CardItemProps {
  card: Card;
  comments: CardComment[];
  onCommentsUpdated: () => Promise<void>;
}

export function CardItem({ card, comments, onCommentsUpdated }: CardItemProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const cardComments = comments.filter(c => c.card_id === card.id);

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
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 text-muted-foreground"
          onClick={() => setIsAddingComment(true)}
        >
          <MessageSquarePlus className="h-4 w-4 mr-1" />
          Add Comment
        </Button>
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