import { Card } from '@/types';

interface ColumnProps {
  title: string;
  cards: Card[];
  className?: string;
}

export function Column({ title, cards, className }: ColumnProps) {
  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {cards.map(card => (
          <div key={card.id} className="p-2 bg-white rounded shadow">
            {card.content}
          </div>
        ))}
      </div>
    </div>
  );
}