import React from 'react';
import { Document, Card, SWOTColumnId, isSWOTColumnId } from '@/types';

interface SWOTTemplateProps {
  document: Document;
  cards: Card[];
}

export function SWOTTemplate({ document, cards }: SWOTTemplateProps) {
  // Filter cards to only include those with valid SWOT columns
  const swotCards = cards.filter(card => isSWOTColumnId(card.column_id));

  const cardsByColumn = swotCards.reduce((acc, card) => {
    const columnId = card.column_id as SWOTColumnId;
    if (!acc[columnId]) {
      acc[columnId] = [];
    }
    acc[columnId].push(card);
    return acc;
  }, {} as Record<SWOTColumnId, Card[]>);

  // Sort cards by position
  Object.values(cardsByColumn).forEach(columnCards => {
    columnCards.sort((a, b) => a.position - b.position);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Strengths</h3>
        <div className="space-y-2">
          {cardsByColumn.strengths?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Weaknesses</h3>
        <div className="space-y-2">
          {cardsByColumn.weaknesses?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Opportunities</h3>
        <div className="space-y-2">
          {cardsByColumn.opportunities?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Threats */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Threats</h3>
        <div className="space-y-2">
          {cardsByColumn.threats?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}