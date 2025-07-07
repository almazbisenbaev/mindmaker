import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { useDocumentContext } from '@/app/doc/[id]/DocumentContext';

interface SWOTTemplateProps {
  document: Document;
  isExporting?: boolean;
}

export function SWOTTemplate({ 
  document, 
  isExporting = false
}: SWOTTemplateProps) {
  const { cards, comments, handleCardCreated, handleCommentsUpdated } = useDocumentContext();
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <div id="document-content" className="grid grid-cols-2 gap-4">
      <Column 
        title="Strengths" 
        cards={cardsByColumn.strengths || []} 
        className="bg-green-50"
        documentId={document.id}
        columnId="strengths"
        isExporting={isExporting}
      />
      <Column 
        title="Weaknesses" 
        cards={cardsByColumn.weaknesses || []} 
        className="bg-red-50"
        documentId={document.id}
        columnId="weaknesses"
        isExporting={isExporting}
      />
      <Column 
        title="Opportunities" 
        cards={cardsByColumn.opportunities || []} 
        className="bg-blue-50"
        documentId={document.id}
        columnId="opportunities"
        isExporting={isExporting}
      />
      <Column 
        title="Threats" 
        cards={cardsByColumn.threats || []} 
        className="bg-yellow-50"
        documentId={document.id}
        columnId="threats"
        isExporting={isExporting}
      />
    </div>
  );
}