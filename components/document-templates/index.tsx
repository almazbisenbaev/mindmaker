import { Document, Card, CardComment } from '@/types';
import { SWOTTemplate } from './swot';
import { LeanTemplate } from './lean';

// Define the template type
export type TemplateType = 'swot' | 'lean';

// Define base props interface for templates
export interface BaseTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
}

// Export the templates object
export const templates = {
  swot: SWOTTemplate,
  lean: LeanTemplate,
} as const;