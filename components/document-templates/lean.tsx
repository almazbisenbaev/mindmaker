import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';

interface LeanTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
  isExporting?: boolean;
  onCardCreated?: () => Promise<void>;
  onCommentsUpdated?: () => Promise<void>;
}

export function LeanTemplate({ 
  document, 
  cards, 
  comments, 
  isExporting = false,
  onCardCreated,
  onCommentsUpdated
}: LeanTemplateProps) {
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <>

      <div id="document-content" className="grid grid-cols-5 grid-rows-3 gap-4">
        <Column
          title="1. Problem"
          cards={cardsByColumn.problem || []}
          comments={comments}
          className="bg-red-50 row-span-2"
          documentId={document.id}
          columnId="problem"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="4. Solution"
          cards={cardsByColumn.solution || []}
          comments={comments}
          className="bg-green-50"
          documentId={document.id}
          columnId="solution"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="8. Key Metrics"
          cards={cardsByColumn.metrics || []}
          comments={comments}
          className="bg-blue-50 col-start-2 row-start-2"
          documentId={document.id}
          columnId="metrics"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="3. Value Proposition"
          cards={cardsByColumn.valueProposition || []}
          comments={comments}
          className="bg-purple-50 row-span-2 col-start-3 row-start-1"
          documentId={document.id}
          columnId="valueProposition"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="9. Unfair Advantage"
          cards={cardsByColumn.unfairAdvantage || []}
          comments={comments}
          className="bg-yellow-50 col-start-4 row-start-1"
          documentId={document.id}
          columnId="unfairAdvantage"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="5. Channels"
          cards={cardsByColumn.channels || []}
          comments={comments}
          className="bg-indigo-50 col-start-4 row-start-2"
          documentId={document.id}
          columnId="channels"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="2. Customer Segments"
          cards={cardsByColumn.customerSegments || []}
          comments={comments}
          className="bg-pink-50 row-span-2 col-start-5 row-start-1"
          documentId={document.id}
          columnId="customerSegments"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="7. Cost Structure"
          cards={cardsByColumn.costStructure || []}
          comments={comments}
          className="bg-gray-50 col-span-2 row-start-3"
          documentId={document.id}
          columnId="costStructure"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
        <Column
          title="6. Revenue Streams"
          cards={cardsByColumn.revenueStreams || []}
          comments={comments}
          className="bg-orange-50 col-span-3 col-start-3 row-start-3"
          documentId={document.id}
          columnId="revenueStreams"
          onCardCreated={onCardCreated}
          onCommentsUpdated={onCommentsUpdated}
          isExporting={isExporting}
        />
      </div>
    </>
  );
}