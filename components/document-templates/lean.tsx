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
    <div id="document-content" className="grid grid-cols-3 gap-4">
      <Column
        title="Problem"
        cards={cardsByColumn.problem || []}
        comments={comments}
        className="bg-red-50"
        documentId={document.id}
        columnId="problem"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Solution"
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
        title="Metrics"
        cards={cardsByColumn.metrics || []}
        comments={comments}
        className="bg-blue-50"
        documentId={document.id}
        columnId="metrics"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Value Proposition"
        cards={cardsByColumn.valueProposition || []}
        comments={comments}
        className="bg-purple-50"
        documentId={document.id}
        columnId="valueProposition"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Unfair Advantage"
        cards={cardsByColumn.unfairAdvantage || []}
        comments={comments}
        className="bg-yellow-50"
        documentId={document.id}
        columnId="unfairAdvantage"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Channels"
        cards={cardsByColumn.channels || []}
        comments={comments}
        className="bg-indigo-50"
        documentId={document.id}
        columnId="channels"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Customer Segments"
        cards={cardsByColumn.customerSegments || []}
        comments={comments}
        className="bg-pink-50"
        documentId={document.id}
        columnId="customerSegments"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Cost Structure"
        cards={cardsByColumn.costStructure || []}
        comments={comments}
        className="bg-gray-50"
        documentId={document.id}
        columnId="costStructure"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
      <Column
        title="Revenue Streams"
        cards={cardsByColumn.revenueStreams || []}
        comments={comments}
        className="bg-orange-50"
        documentId={document.id}
        columnId="revenueStreams"
        onCardCreated={onCardCreated}
        onCommentsUpdated={onCommentsUpdated}
        isExporting={isExporting}
      />
    </div>
  );
}