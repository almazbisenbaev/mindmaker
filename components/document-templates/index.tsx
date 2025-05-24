import { SWOTTemplate } from './swot';
import { LeanTemplate } from './lean';

export const templates = {
  swot: SWOTTemplate,
  lean: LeanTemplate,
} as const;

export type TemplateType = keyof typeof templates;