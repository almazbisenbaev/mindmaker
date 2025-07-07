import React, { createContext, useContext } from 'react';
import { Document, Card, CardComment } from '@/types';

export interface DocumentContextType {
  document: Document | null;
  setDocument: React.Dispatch<React.SetStateAction<Document | null>>;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  comments: CardComment[];
  setComments: React.Dispatch<React.SetStateAction<CardComment[]>>;
  refreshCards: () => Promise<void>;
  refreshComments: () => Promise<void>;
  handleCardCreated: () => Promise<void>;
  handleCommentsUpdated: () => Promise<void>;
  isOwner: boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function useDocumentContext() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocumentContext must be used within DocumentProvider');
  return ctx;
}

export function DocumentProvider({ children, value }: { children: React.ReactNode, value: DocumentContextType }) {
  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
} 