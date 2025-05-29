import { Card, CardComment } from '@/types';
import { CardItem } from './CardItem';
import { CreateCardForm } from './CreateCardForm';

interface ColumnProps {
  title: string;
  cards: Card[];
  comments: CardComment[];
  className?: string;
  documentId: string;
  columnId: string;
  onCardCreated: () => Promise<void>;
  onCommentsUpdated: () => Promise<void>;
}

export function Column({ 
  title, 
  cards, 
  comments, 
  className,
  documentId,
  columnId,
  onCardCreated,
  onCommentsUpdated
}: ColumnProps) {
  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {cards.map(card => (
          <CardItem 
            key={card.id} 
            card={card}
            comments={comments}
            onCommentsUpdated={onCommentsUpdated}
          />
        ))}
      </div>
      <CreateCardForm 
        documentId={documentId}
        columnId={columnId}
        onCardCreated={onCardCreated}
      />
    </div>
  );
}