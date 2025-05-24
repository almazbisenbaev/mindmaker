import { Card } from '@/types';

export function useCardsByColumn(cards: Card[]) {
  const grouped = cards.reduce((acc, card) => {
    const col = card.column_id;
    if (!acc[col]) acc[col] = [];
    acc[col].push(card);
    return acc;
  }, {} as Record<string, Card[]>);

  // Sort cards in each column
  Object.values(grouped).forEach(cards => 
    cards.sort((a, b) => a.position - b.position)
  );

  return grouped;
}