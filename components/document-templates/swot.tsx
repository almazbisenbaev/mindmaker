import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { createClient } from '@/utils/supabase/client';

interface SWOTTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
  isExporting?: boolean;
}

export function SWOTTemplate({ document, cards: initialCards, comments: initialComments, isExporting = false }: SWOTTemplateProps) {
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
    <div id="document-content" className="grid grid-cols-2 gap-4">
      <Column 
        title="Strengths" 
        cards={cardsByColumn.strengths || []} 
        comments={comments}
        className="bg-green-50"
        documentId={document.id}
        columnId="strengths"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Weaknesses" 
        cards={cardsByColumn.weaknesses || []} 
        comments={comments}
        className="bg-red-50"
        documentId={document.id}
        columnId="weaknesses"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Opportunities" 
        cards={cardsByColumn.opportunities || []} 
        comments={comments}
        className="bg-blue-50"
        documentId={document.id}
        columnId="opportunities"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Threats" 
        cards={cardsByColumn.threats || []} 
        comments={comments}
        className="bg-yellow-50"
        documentId={document.id}
        columnId="threats"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
    </div>
  );
}