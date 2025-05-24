import { Card, CardComment } from '@/types';
import { CardItem } from './CardItem';

interface ColumnProps {
  title: string;
  cards: Card[];
  comments: CardComment[];
  className?: string;
}

export function Column({ title, cards, comments, className }: ColumnProps) {
  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {cards.map(card => (
          <CardItem 
            key={card.id} 
            card={card}
            comments={comments}
          />
        ))}
      </div>
    </div>
  );
}