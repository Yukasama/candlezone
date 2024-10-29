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
      value: filters.exchange ?? 'Any',
      options: exchanges,
      colspan: false,
    },
    {
      id: 'country',
      label: 'Country',
      value: filters.country ?? 'Any',
      options: countries,
      colspan: false,
    },
    {
      id: 'sector',
      label: 'Sector',
      value: filters.sector ?? 'Any',
      options: sectors,
      colspan: true,
    },
    {
      id: 'industry',
      label: 'Industry',
      value: filters.industry ?? 'Any',
      options: industries,
      colspan: true,
    },
    {
      id: 'earningsDate',
      label: 'Earnings Date',
      value: filters.earningsDate ?? 'Any',
      options: earningsDates,
      colspan: false,
    },
    {
      id: 'mktCap',
      label: 'Market Cap',
      value: filters.mktCap ?? 'Any',
      options: marketCaps,
      colspan: false,
    },
  ];

  const FUNDAMENTAL_FILTERS = [
    {
      id: 'peRatioMin',
      label: 'P/E Ratio Min',
      value: filters.peRatioMin ?? 'Any',
      options: peRatios,
      colspan: false,
    },
    {
      id: 'peRatioMax',
      label: 'P/E Ratio Max',
      value: filters.peRatioMax ?? 'Any',
      options: peRatios,
      colspan: false,
    },
    {
      id: 'pegRatioMin',
      label: 'PEG Ratio Min',
      value: filters.pegRatioMin ?? 'Any',
      options: pegRatios,
      colspan: false,
    },
    {
      id: 'pegRatioMax',
      label: 'PEG Ratio Max',
      value: filters.pegRatioMax ?? 'Any',
      options: pegRatios,
      colspan: false,
    },
  ];

  const TECHNICAL_FILTERS = [
    {
      id: 'sma50Min',
      label: 'SMA 50 Min',
      value: filters.sma50Min ?? 'Any',
      options: ['-20%'],
      colspan: false,
    },
    {
      id: 'sma50Max',
      label: 'SMA 50 Max',
      value: filters.sma50Max ?? 'Any',
      options: ['20%'],
      colspan: false,
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
