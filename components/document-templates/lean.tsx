import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { createClient } from '@/utils/supabase/client';

interface LeanTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
  isExporting?: boolean;
}

export function LeanTemplate({ document, cards: initialCards, comments: initialComments, isExporting = false }: LeanTemplateProps) {
  const [cards, setCards] = React.useState(initialCards);
  const [comments, setComments] = React.useState(initialComments);
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

  const refreshComments = async () => {
    const supabase = createClient();
    const { data: updatedComments } = await supabase
      .from('comments')
      .select('*')
      .in('card_id', cards.map(card => card.id))
      .order('created_at');

    if (updatedComments) {
      setComments(updatedComments);
    }
  };

  const handleCardCreated = async () => {
    await refreshCards();
  };

  const handleCommentsUpdated = async () => {
    await refreshComments();
  };

  return (
    <div id="document-content" className="grid grid-cols-3 gap-4">
      <Column
        title="Problem"
        cards={cardsByColumn.problem || []}
        comments={comments}
        className="bg-red-50"
        documentId={document.id}
        columnId="problem"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Solution"
        cards={cardsByColumn.solution || []}
        comments={comments}
        className="bg-green-50"
        documentId={document.id}
        columnId="solution"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Metrics"
        cards={cardsByColumn.metrics || []}
        comments={comments}
        className="bg-blue-50"
        documentId={document.id}
        columnId="metrics"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Value Proposition"
        cards={cardsByColumn.valueProposition || []}
        comments={comments}
        className="bg-purple-50"
        documentId={document.id}
        columnId="valueProposition"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Unfair Advantage"
        cards={cardsByColumn.unfairAdvantage || []}
        comments={comments}
        className="bg-yellow-50"
        documentId={document.id}
        columnId="unfairAdvantage"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Channels"
        cards={cardsByColumn.channels || []}
        comments={comments}
        className="bg-indigo-50"
        documentId={document.id}
        columnId="channels"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Customer Segments"
        cards={cardsByColumn.customerSegments || []}
        comments={comments}
        className="bg-pink-50"
        documentId={document.id}
        columnId="customerSegments"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Cost Structure"
        cards={cardsByColumn.costStructure || []}
        comments={comments}
        className="bg-gray-50"
        documentId={document.id}
        columnId="costStructure"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Revenue Streams"
        cards={cardsByColumn.revenueStreams || []}
        comments={comments}
        className="bg-orange-50"
        documentId={document.id}
        columnId="revenueStreams"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
    </div>
  );
}