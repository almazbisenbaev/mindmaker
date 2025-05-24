import { Card, CardComment } from '@/types';
import { CommentItem } from './CommentItem';

interface CardItemProps {
  card: Card;
  comments: CardComment[];
}

export function CardItem({ card, comments }: CardItemProps) {
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
    </div>
  );
}