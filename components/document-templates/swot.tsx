import React from 'react';
import { Document, Card, CardComment } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';

interface SWOTTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];  // Updated to CardComment
}

export function SWOTTemplate({ document, cards, comments }: SWOTTemplateProps) {
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Column 
        title="Strengths" 
        cards={cardsByColumn.strengths || []} 
        comments={comments}
        className="bg-green-50"
      />
      <Column 
        title="Weaknesses" 
        cards={cardsByColumn.weaknesses || []} 
        comments={comments}
        className="bg-red-50"
      />
      <Column 
        title="Opportunities" 
        cards={cardsByColumn.opportunities || []} 
        comments={comments}
        className="bg-blue-50"
      />
      <Column 
        title="Threats" 
        cards={cardsByColumn.threats || []} 
        comments={comments}
        className="bg-yellow-50"
      />
    </div>
  );
}