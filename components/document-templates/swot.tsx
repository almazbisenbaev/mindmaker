import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';

interface SWOTTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
  isExporting?: boolean;
  onCardCreated?: () => Promise<void>;
  onCommentsUpdated?: () => Promise<void>;
}

export function SWOTTemplate({ 
  document, 
  cards, 
  comments, 
  isExporting = false,
  onCardCreated,
  onCommentsUpdated
}: SWOTTemplateProps) {
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <div id="document-content" className="grid grid-cols-2 gap-4">
      <Column 
        title="Strengths" 
        cards={cardsByColumn.strengths || []} 
        comments={comments}
        className="bg-green-50"
        documentId={document.id}
        columnId="strengths"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Weaknesses" 
        cards={cardsByColumn.weaknesses || []} 
        comments={comments}
        className="bg-red-50"
        documentId={document.id}
        columnId="weaknesses"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Opportunities" 
        cards={cardsByColumn.opportunities || []} 
        comments={comments}
        className="bg-blue-50"
        documentId={document.id}
        columnId="opportunities"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Threats" 
        cards={cardsByColumn.threats || []} 
        comments={comments}
        className="bg-yellow-50"
        documentId={document.id}
        columnId="threats"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
    </div>
  );
}