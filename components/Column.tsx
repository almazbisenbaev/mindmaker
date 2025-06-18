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
  onCardCreated?: () => Promise<void>;
  onCommentsUpdated?: () => Promise<void>;
  isExporting?: boolean;
}

const columnPlaceholders = {
  // SWOT Analysis
  strengths: "Internal factors that give you an advantage over others",
  weaknesses: "Internal factors that put you at a disadvantage",
  opportunities: "External factors that could be beneficial to you",
  threats: "External factors that could cause trouble for you",

  // Lean Canvas
  problem: "What problem are you solving?",
  solution: "How will you solve it?",
  metrics: "How will you measure success?",
  valueProposition: "What unique value do you offer?",
  unfairAdvantage: "What makes you different?",
  channels: "How will you reach customers?",
  customerSegments: "Who are your target customers?",
  costStructure: "What are your major costs?",
  keyPartners: "Who are your key partners?",

  // PESTEL Analysis
  political: "How do political factors affect your business?",
  economic: "How do economic factors affect your business?",
  social: "How do social factors affect your business?",
  technological: "How do technological factors affect your business?",
  environmental: "How do environmental factors affect your business?",
  legal: "How do legal factors affect your business?"
};

// Helper function to get placeholder text
const getColumnPlaceholder = (columnId: string, title: string): string => {
  // First try to get the exact match
  const placeholder = columnPlaceholders[columnId as keyof typeof columnPlaceholders];
  
  // If not found, try to find a case-insensitive match
  if (!placeholder) {
    const lowerId = columnId.toLowerCase();
    const lowerTitle = title.toLowerCase();
    
    // Try to find a matching placeholder by title
    for (const [key, value] of Object.entries(columnPlaceholders)) {
      if (key.toLowerCase().includes(lowerTitle) || 
          key.toLowerCase().includes(lowerId)) {
        return value;
      }
    }
  }
  
  // If still not found, return a generic placeholder
  return `Add content related to ${title}`;
};

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
    <div className={`p-2 rounded-xl border border-[rgba(0,0,0,0.05)] ${className} relative`}>

      <h3 className="text-md font-semibold p-3">{title}</h3>

      <div className="space-y-3 p-3">
        {cards.length === 0 && !isExporting && (
          <div className="text-sm text-muted-foreground p-4 rounded-lg bg-background/25 border border-dashed border-muted-foreground/25">
            {getColumnPlaceholder(columnId, title)}
          </div>
        )}
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