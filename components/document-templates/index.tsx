import { SWOTTemplate } from './swot';
import { LeanTemplate } from './lean';
// Import other templates as needed

export const templates = {
  'swot': SWOTTemplate,
  'lean': LeanTemplate,
//   'pestel': TemplatePestel,
} as const;

export type TemplateType = keyof typeof templates;