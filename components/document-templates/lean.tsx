import React from 'react';
import { Document, Card, LeanColumnId, isLeanColumnId } from '@/types';

interface LeanTemplateProps {
  document: Document;
  cards: Card[];
}

export function LeanTemplate({ document, cards }: LeanTemplateProps) {
  // Filter cards to only include those with valid Lean columns
  const leanCards = cards.filter(card => isLeanColumnId(card.column_id));

  const cardsByColumn = leanCards.reduce((acc, card) => {
    const columnId = card.column_id as LeanColumnId;
    if (!acc[columnId]) {
      acc[columnId] = [];
    }
    acc[columnId].push(card);
    return acc;
  }, {} as Record<LeanColumnId, Card[]>);

  // Sort cards by position
  Object.values(cardsByColumn).forEach(columnCards => {
    columnCards.sort((a, b) => a.position - b.position);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Problem */}
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Problem</h3>
        <div className="space-y-2">
          {cardsByColumn.problem?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Solution */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Solution</h3>
        <div className="space-y-2">
          {cardsByColumn.solution?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Metrics</h3>
        <div className="space-y-2">
          {cardsByColumn.metrics?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Unique Value Proposition */}
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 md:col-span-3">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Unique Value Proposition</h3>
        <div className="space-y-2">
          {cardsByColumn.value_proposition?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Unfair Advantage */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Unfair Advantage</h3>
        <div className="space-y-2">
          {cardsByColumn.unfair_advantage?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Channels</h3>
        <div className="space-y-2">
          {cardsByColumn.channels?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Segments */}
      <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
        <h3 className="text-lg font-semibold text-pink-800 mb-2">Customer Segments</h3>
        <div className="space-y-2">
          {cardsByColumn.customer_segments?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Cost Structure */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Cost Structure</h3>
        <div className="space-y-2">
          {cardsByColumn.cost_structure?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">Revenue Streams</h3>
        <div className="space-y-2">
          {cardsByColumn.revenue_streams?.map((card) => (
            <div key={card.id} className="p-2 bg-white rounded shadow">
              {card.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}