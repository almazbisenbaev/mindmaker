import React from 'react';
import { Document } from '@/types';
import { Column } from '../Column';
import { useCardsByColumn } from '@/hooks/useCardsByColumn';
import { useDocumentContext } from '@/app/doc/[id]/DocumentContext';

interface PortersTemplateProps {
  document: Document;
  isExporting?: boolean;
}

export function PortersTemplate({
  document,
  isExporting = false,
}: PortersTemplateProps) {
  const { cards } = useDocumentContext();
  const cardsByColumn = useCardsByColumn(cards);

  return (
    <div id="document-content" className="grid grid-cols-3 gap-4">
      <Column
        title="Competitive Rivalry"
        cards={cardsByColumn.competitiveRivalry || []}
        className="bg-red-100"
        documentId={document.id}
        columnId="competitiveRivalry"
        isExporting={isExporting}
      />
      <Column
        title="Supplier Power"
        cards={cardsByColumn.supplierPower || []}
        className="bg-blue-100"
        documentId={document.id}
        columnId="supplierPower"
        isExporting={isExporting}
      />
      <Column
        title="Buyer Power"
        cards={cardsByColumn.buyerPower || []}
        className="bg-green-100"
        documentId={document.id}
        columnId="buyerPower"
        isExporting={isExporting}
      />
      <Column
        title="Threat of Substitution"
        cards={cardsByColumn.threatOfSubstitution || []}
        className="bg-yellow-100"
        documentId={document.id}
        columnId="threatOfSubstitution"
        isExporting={isExporting}
      />
      <Column
        title="Threat of New Entry"
        cards={cardsByColumn.threatOfNewEntry || []}
        className="bg-purple-100 col-span-2"
        documentId={document.id}
        columnId="threatOfNewEntry"
        isExporting={isExporting}
      />
    </div>
  );
} 