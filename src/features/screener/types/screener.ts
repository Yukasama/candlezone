import { SCREENER_TABS } from '../config/screener-tabs';

export interface ScreenerColumn {
  accessor: string;
  label: string;
  sortable: boolean;
}

export type ScreenerTableColumns = Record<TabsType, ScreenerColumn[]>;

export type TabsType = (typeof SCREENER_TABS)[number];
