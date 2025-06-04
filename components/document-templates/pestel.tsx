import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { createClient } from '@/utils/supabase/client';

interface PESTELTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
  isExporting?: boolean;
}

export function PESTELTemplate({ document, cards: initialCards, comments: initialComments, isExporting = false }: PESTELTemplateProps) {
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
        title="Political" 
        cards={cardsByColumn.political || []} 
        comments={comments}
        className="bg-purple-50"
        documentId={document.id}
        columnId="political"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Economic" 
        cards={cardsByColumn.economic || []} 
        comments={comments}
        className="bg-blue-50"
        documentId={document.id}
        columnId="economic"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Social" 
        cards={cardsByColumn.social || []} 
        comments={comments}
        className="bg-green-50"
        documentId={document.id}
        columnId="social"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Technological" 
        cards={cardsByColumn.technological || []} 
        comments={comments}
        className="bg-yellow-50"
        documentId={document.id}
        columnId="technological"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Environmental" 
        cards={cardsByColumn.environmental || []} 
        comments={comments}
        className="bg-teal-50"
        documentId={document.id}
        columnId="environmental"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Legal" 
        cards={cardsByColumn.legal || []} 
        comments={comments}
        className="bg-red-50"
        documentId={document.id}
        columnId="legal"
        onCardCreated={handleCardCreated}
        onCommentsUpdated={handleCommentsUpdated}
        isExporting={isExporting}
      />
    </div>
  );
}