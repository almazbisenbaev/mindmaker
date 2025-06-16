import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';

interface PESTELTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
  isExporting?: boolean;
  onCardCreated?: () => Promise<void>;
  onCommentsUpdated?: () => Promise<void>;
}

export function PESTELTemplate({ 
  document, 
  cards, 
  comments, 
  isExporting = false,
  onCardCreated,
  onCommentsUpdated
}: PESTELTemplateProps) {
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <div id="document-content" className="grid grid-cols-3 gap-4">
      <Column 
        title="Political" 
        cards={cardsByColumn.political || []} 
        comments={comments}
        className="bg-purple-50"
        documentId={document.id}
        columnId="political"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Economic" 
        cards={cardsByColumn.economic || []} 
        comments={comments}
        className="bg-blue-50"
        documentId={document.id}
        columnId="economic"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Social" 
        cards={cardsByColumn.social || []} 
        comments={comments}
        className="bg-green-50"
        documentId={document.id}
        columnId="social"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Technological" 
        cards={cardsByColumn.technological || []} 
        comments={comments}
        className="bg-yellow-50"
        documentId={document.id}
        columnId="technological"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Environmental" 
        cards={cardsByColumn.environmental || []} 
        comments={comments}
        className="bg-teal-50"
        documentId={document.id}
        columnId="environmental"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column 
        title="Legal" 
        cards={cardsByColumn.legal || []} 
        comments={comments}
        className="bg-red-50"
        documentId={document.id}
        columnId="legal"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
    </div>
  );
}