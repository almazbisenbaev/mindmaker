import { useState } from 'react';
import { Card, CardComment } from '@/types';
import { CardItem } from './CardItem';
import { CreateCardForm } from './CreateCardForm';
import { Button } from '@/components/ui/button';

interface ColumnProps {
  title: string;
  cards: Card[];
  comments: CardComment[];
  className?: string;
  documentId: string;
  columnId: string;
  onCardCreated: () => Promise<void>;
  onCommentsUpdated: () => Promise<void>;
  isExporting?: boolean;
}

export function Column({ 
  title, 
  cards, 
  comments, 
  className,
  documentId,
  columnId,
  onCardCreated,
  onCommentsUpdated,
  isExporting = false
}: ColumnProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={`p-8 rounded-xl ${className} relative`}>

      <h3 className="text-md font-semibold mb-5 transform uppercase">{title}</h3>

      <div className="space-y-3">
        {cards.map(card => (
          <CardItem 
            key={card.id} 
            card={card}
            comments={comments}
            onCommentsUpdated={onCommentsUpdated}
            isExporting={isExporting}
          />
        ))}
      </div>

      {showForm && (
        <CreateCardForm 
          documentId={documentId}
          columnId={columnId}
          onCardCreated={onCardCreated}
          onClose={() => setShowForm(false)}
        />
      )}
      
      {!isExporting && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 hover:bg-white"
          size="sm"
          variant="ghost"
        >
          Add Card
        </Button>
      )}

    </div>
  );
}