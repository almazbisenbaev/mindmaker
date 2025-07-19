import { Document, Card, CardComment } from '@/types';
import { SWOTTemplate } from './swot';
import { LeanTemplate } from './lean';
import { PESTELTemplate } from './pestel';
import { PortersTemplate } from './porters';

// Define the template type
export type TemplateType = 'swot' | 'lean' | 'pestel' | 'porters';

// Define base props interface for templates
export interface BaseTemplateProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
  isExporting?: boolean;
  onCardCreated?: () => Promise<void>;
  onCommentsUpdated?: () => Promise<void>;
}

// Export the templates object
export const templates = {
  swot: SWOTTemplate,
  lean: LeanTemplate,
  pestel: PESTELTemplate,
  porters: PortersTemplate,
} as const;