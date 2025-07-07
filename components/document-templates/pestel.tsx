import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { useDocumentContext } from '@/app/doc/[id]/DocumentContext';

interface PESTELTemplateProps {
  document: Document;
  isExporting?: boolean;
}

export function PESTELTemplate({ 
  document, 
  isExporting = false
}: PESTELTemplateProps) {
  const { cards, comments, handleCardCreated, handleCommentsUpdated } = useDocumentContext();
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <>
      <div id="document-content" className="grid grid-cols-3 gap-4">
        <Column 
          title="Political" 
          cards={cardsByColumn.political || []} 
          className="bg-yellow-50"
          documentId={document.id}
          columnId="political"
          isExporting={isExporting}
        />
        <Column 
          title="Economic" 
          cards={cardsByColumn.economic || []} 
          className="bg-purple-50"
          documentId={document.id}
          columnId="economic"
          isExporting={isExporting}
        />
        <Column 
          title="Social" 
          cards={cardsByColumn.social || []} 
          className="bg-green-50"
          documentId={document.id}
          columnId="social"
          isExporting={isExporting}
        />
        <Column 
          title="Technological" 
          cards={cardsByColumn.technological || []} 
          className="bg-red-50"
          documentId={document.id}
          columnId="technological"
          isExporting={isExporting}
        />
        <Column 
          title="Environmental" 
          cards={cardsByColumn.environmental || []} 
          className="bg-teal-50"
          documentId={document.id}
          columnId="environmental"
          isExporting={isExporting}
        />
        <Column 
          title="Legal" 
          cards={cardsByColumn.legal || []} 
          className="bg-blue-50"
          documentId={document.id}
          columnId="legal"
          isExporting={isExporting}
        />
      </div>
    </>
  );
}