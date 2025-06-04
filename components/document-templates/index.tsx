import { Document, Card, CardComment } from '@/types';
import { SWOTTemplate } from './swot';
import { LeanTemplate } from './lean';
import { PESTELTemplate } from './pestel';

// Define the template type
export type TemplateType = 'swot' | 'lean' | 'pestel';

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
  pestel: PESTELTemplate,
} as const;