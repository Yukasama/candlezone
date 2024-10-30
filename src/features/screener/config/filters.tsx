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
  peRatios,
  pegRatios,
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
    },
    {
      id: 'country',
      label: 'Country',
      value: filters.country,
      options: countries,
    },
    {
      id: 'sector',
      label: 'Sector',
      value: filters.sector,
      options: sectors,
    },
    {
      id: 'industry',
      label: 'Industry',
      value: filters.industry,
      options: industries,
    },
    {
      id: 'earningsDate',
      label: 'Earnings Date',
      value: filters.earningsDate,
      options: earningsDates,
    },
    {
      id: 'mktCap',
      label: 'Market Cap',
      value: filters.mktCap,
      options: marketCaps,
    },
  ];

  const FUNDAMENTAL_FILTERS = [
    {
      id: 'peRatioMin',
      label: 'P/E Ratio Min',
      value: filters.peRatioMin,
      options: peRatios,
    },
    {
      id: 'peRatioMax',
      label: 'P/E Ratio Max',
      value: filters.peRatioMax,
      options: peRatios,
    },
    {
      id: 'pegRatioMin',
      label: 'PEG Ratio Min',
      value: filters.pegRatioMin,
      options: pegRatios,
    },
    {
      id: 'pegRatioMax',
      label: 'PEG Ratio Max',
      value: filters.pegRatioMax,
      options: pegRatios,
    },
  ];

  const TECHNICAL_FILTERS = [
    {
      id: 'sma50Min',
      label: 'SMA 50 Min',
      value: filters.sma50Min,
      options: ['-20%'],
    },
    {
      id: 'sma50Max',
      label: 'SMA 50 Max',
      value: filters.sma50Max,
      options: ['20%'],
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
