import { SCREENER_TABS } from '../config/screener-tabs';

export type TabsType = (typeof SCREENER_TABS)[number];

export interface ScreenerColumn {
  label: string;
  sortable: boolean;
  accessor: string;
}

export type ScreenerTableColumns = Record<TabsType, ScreenerColumn[]>;
