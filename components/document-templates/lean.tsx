import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { createClient } from '@/utils/supabase/client';

interface LeanTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
}

export function LeanTemplate({ document, cards: initialCards, comments }: LeanTemplateProps) {
  const [cards, setCards] = React.useState(initialCards);
  const cardsByColumn = useCardsByColumn(cards);

  const refreshCards = async () => {
    const supabase = createClient();
    const { data: updatedCards } = await supabase
      .from('cards')
      .select('*')
      .eq('document_id', document.id)
      .order('position');

    if (updatedCards) {
      setCards(updatedCards);
    }
  };

  const handleCardCreated = async () => {
    await refreshCards();
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <Column
        title="Problem"
        cards={cardsByColumn.problem || []}
        comments={comments}
        className="bg-red-50"
        documentId={document.id}
        columnId="problem"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Solution"
        cards={cardsByColumn.solution || []}
        comments={comments}
        className="bg-green-50"
        documentId={document.id}
        columnId="solution"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Metrics"
        cards={cardsByColumn.metrics || []}
        comments={comments}
        className="bg-blue-50"
        documentId={document.id}
        columnId="metrics"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Value Proposition"
        cards={cardsByColumn.valueProposition || []}
        comments={comments}
        className="bg-purple-50"
        documentId={document.id}
        columnId="valueProposition"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Unfair Advantage"
        cards={cardsByColumn.unfairAdvantage || []}
        comments={comments}
        className="bg-yellow-50"
        documentId={document.id}
        columnId="unfairAdvantage"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Channels"
        cards={cardsByColumn.channels || []}
        comments={comments}
        className="bg-indigo-50"
        documentId={document.id}
        columnId="channels"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Customer Segments"
        cards={cardsByColumn.customerSegments || []}
        comments={comments}
        className="bg-pink-50"
        documentId={document.id}
        columnId="customerSegments"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Cost Structure"
        cards={cardsByColumn.costStructure || []}
        comments={comments}
        className="bg-gray-50"
        documentId={document.id}
        columnId="costStructure"
        onCardCreated={handleCardCreated}
      />
      <Column
        title="Revenue Streams"
        cards={cardsByColumn.revenueStreams || []}
        comments={comments}
        className="bg-orange-50"
        documentId={document.id}
        columnId="revenueStreams"
        onCardCreated={handleCardCreated}
      />
    </div>
  );
}