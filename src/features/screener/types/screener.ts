export type TabsType =
  | 'general'
  | 'valuation'
  | 'performance'
  | 'financials'
  | 'insiders';

export interface ScreenerColumn {
  label: string;
  sortable: boolean;
  accessor: string;
}

export type ScreenerTableColumns = Record<TabsType, ScreenerColumn[]>;
