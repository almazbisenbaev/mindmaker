export type SWOTColumnId = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

export type LeanColumnId = 
  | 'problem' 
  | 'solution'
  | 'metrics'
  | 'value_proposition'
  | 'unfair_advantage'
  | 'channels'
  | 'customer_segments'
  | 'cost_structure'
  | 'revenue_streams';

export type PESTELColumnId =
  | 'political'
  | 'economic'
  | 'social'
  | 'technological'
  | 'environmental'
  | 'legal';

export type ColumnId = SWOTColumnId | LeanColumnId | PESTELColumnId;

export interface Document {
  id: string;
  user_id: string;
  template: 'swot' | 'lean' | 'pestel';
  title: string;
  status: 'public' | 'private';
  created_at: string;
  updated_at: string;
  description: string;
}

export interface Card {
  id: string;
  document_id: string;
  column_id: ColumnId;
  content: string;
  position: number;
  created_at: string;
  updated_at: string;
}

// Add these type guard functions as named exports
export const isLeanColumnId = (columnId: string): columnId is LeanColumnId => {
  const leanColumns: LeanColumnId[] = [
    'problem',
    'solution',
    'metrics',
    'value_proposition',
    'unfair_advantage',
    'channels',
    'customer_segments',
    'cost_structure',
    'revenue_streams'
  ];
  return leanColumns.includes(columnId as LeanColumnId);
};

export const isSWOTColumnId = (columnId: ColumnId): columnId is SWOTColumnId => {
  const swotColumns: SWOTColumnId[] = [
    'strengths',
    'weaknesses',
    'opportunities',
    'threats'
  ];
  return swotColumns.includes(columnId as SWOTColumnId);
};

export const isPESTELColumnId = (columnId: string): columnId is PESTELColumnId => {
  const pestelColumns: PESTELColumnId[] = [
    'political',
    'economic',
    'social',
    'technological',
    'environmental',
    'legal'
  ];
  return pestelColumns.includes(columnId as PESTELColumnId);
};



export interface CardComment {
  id: string;
  card_id: string;
  user_id: string;
  content: string;
  created_at: string;
}