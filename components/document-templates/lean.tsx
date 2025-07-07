import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { useDocumentContext } from '@/app/doc/[id]/DocumentContext';

interface LeanTemplateProps {
  document: Document;
  isExporting?: boolean;
}

export function LeanTemplate({ 
  document, 
  isExporting = false
}: LeanTemplateProps) {
  const { cards, comments, handleCardCreated, handleCommentsUpdated } = useDocumentContext();
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <>
      <div id="document-content" className="grid grid-cols-5 grid-rows-3 gap-4">
        <Column
          title="1. Problem"
          cards={cardsByColumn.problem || []}
          className="bg-red-50 row-span-2"
          documentId={document.id}
          columnId="problem"
          isExporting={isExporting}
        />
        <Column
          title="4. Solution"
          cards={cardsByColumn.solution || []}
          className="bg-green-50"
          documentId={document.id}
          columnId="solution"
          isExporting={isExporting}
        />
        <Column
          title="8. Key Metrics"
          cards={cardsByColumn.metrics || []}
          className="bg-blue-50 col-start-2 row-start-2"
          documentId={document.id}
          columnId="metrics"
          isExporting={isExporting}
        />
        <Column
          title="3. Value Proposition"
          cards={cardsByColumn.valueProposition || []}
          className="bg-purple-50 row-span-2 col-start-3 row-start-1"
          documentId={document.id}
          columnId="valueProposition"
          isExporting={isExporting}
        />
        <Column
          title="9. Unfair Advantage"
          cards={cardsByColumn.unfairAdvantage || []}
          className="bg-yellow-50 col-start-4 row-start-1"
          documentId={document.id}
          columnId="unfairAdvantage"
          isExporting={isExporting}
        />
        <Column
          title="5. Channels"
          cards={cardsByColumn.channels || []}
          className="bg-indigo-50 col-start-4 row-start-2"
          documentId={document.id}
          columnId="channels"
          isExporting={isExporting}
        />
        <Column
          title="2. Customer Segments"
          cards={cardsByColumn.customerSegments || []}
          className="bg-pink-50 row-span-2 col-start-5 row-start-1"
          documentId={document.id}
          columnId="customerSegments"
          isExporting={isExporting}
        />
        <Column
          title="7. Cost Structure"
          cards={cardsByColumn.costStructure || []}
          className="bg-gray-50 col-span-2 row-start-3"
          documentId={document.id}
          columnId="costStructure"
          isExporting={isExporting}
        />
        <Column
          title="6. Revenue Streams"
          cards={cardsByColumn.revenueStreams || []}
          className="bg-orange-50 col-span-3 col-start-3 row-start-3"
          documentId={document.id}
          columnId="revenueStreams"
          isExporting={isExporting}
        />
      </div>
    </>
  );
}