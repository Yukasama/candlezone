import {
  ScreenerProps,
  ScreenerSchema,
} from '@/features/screener/lib/validators';
import { BarChart2, FileText, Layers } from 'lucide-react';
import { ReadonlyURLSearchParams } from 'next/navigation';
import {
  countries,
  earningsDates,
  exchanges,
  industries,
  marketCaps,
  sectors,
} from './filter-values';

export const getFiltersFromSearchParams = (
  searchParams: ReadonlyURLSearchParams,
): ScreenerProps => {
  const params = Object.fromEntries(searchParams.entries());
  return ScreenerSchema.parse(params);
};

export const getFilters = (filters: ScreenerProps) => {
  const DESCRIPTIVE_FILTERS = [
    {
      id: 'exchange',
      label: 'Exchange',
      value: filters.exchange,
      options: exchanges,
      selector: 'select',
    },
    {
      id: 'country',
      label: 'Country',
      value: filters.country,
      options: countries,
      selector: 'select',
    },
    {
      id: 'sector',
      label: 'Sector',
      value: filters.sector,
      options: sectors,
      selector: 'select',
    },
    {
      id: 'industry',
      label: 'Industry',
      value: filters.industry,
      options: industries,
      selector: 'select',
    },
    {
      id: 'earningsDate',
      label: 'Earnings Date',
      value: filters.earningsDate,
      options: earningsDates,
      selector: 'select',
    },
    {
      id: 'mktCap',
      label: 'Market Cap',
      value: filters.mktCap,
      options: marketCaps,
      selector: 'select',
    },
  ];

  const FUNDAMENTAL_FILTERS = [
    {
      id: 'peRatio',
      label: 'P/E Ratio',
      value: [filters.peRatioMin, filters.peRatioMax],
      min: 0,
      max: 100,
      selector: 'slider',
    },
    {
      id: 'pegRatio',
      label: 'PEG Ratio',
      value: [filters.pegRatioMin, filters.pegRatioMax],
      min: 0,
      max: 10,
      selector: 'slider',
    },
    {
      id: 'grossMargin',
      label: 'Gross Margin (%)',
      value: [filters.grossMarginMin, filters.grossMarginMax],
      min: 0,
      max: 100,
      selector: 'slider',
    },
    {
      id: 'netMargin',
      label: 'Net Margin (%)',
      value: [filters.netMarginMin, filters.netMarginMax],
      min: -50,
      max: 50,
      selector: 'slider',
    },
  ];

  const TECHNICAL_FILTERS = [
    {
      id: 'sma50',
      label: 'SMA 50',
      value: [filters.sma50Min, filters.sma50Max],
      options: [-20, 20],
      selector: 'slider',
    },
  ];

  return [
    {
      id: 'descriptive',
      name: 'Descriptive',
      icon: <FileText size={18} />,
      filters: DESCRIPTIVE_FILTERS,
    },
    {
      id: 'fundamental',
      name: 'Fundamental',
      icon: <Layers size={18} />,
      filters: FUNDAMENTAL_FILTERS,
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: <BarChart2 size={18} />,
      filters: TECHNICAL_FILTERS,
    },
  ];
};
