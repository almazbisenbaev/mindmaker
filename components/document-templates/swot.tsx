import React from 'react';
import { Document, Card, SWOTColumnId, isSWOTColumnId } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';

interface SWOTTemplateProps {
  document: Document;
  cards: Card[];
}

export function SWOTTemplate({ document, cards }: SWOTTemplateProps) {
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Column 
        title="Strengths" 
        cards={cardsByColumn.strengths || []} 
        className="bg-green-50"
      />
      <Column 
        title="Weaknesses" 
        cards={cardsByColumn.weaknesses || []} 
        className="bg-red-50"
      />
      <Column 
        title="Opportunities" 
        cards={cardsByColumn.opportunities || []} 
        className="bg-blue-50"
      />
      <Column 
        title="Threats" 
        cards={cardsByColumn.threats || []} 
        className="bg-yellow-50"
      />
    </div>
  );
}