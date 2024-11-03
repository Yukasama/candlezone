import {
  ScreenerProps,
  ScreenerSchema,
} from '@/features/screener/lib/validators';
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
  const descriptive = [
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

  const fundamental = [
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
      max: 20,
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

  const technical = [
    {
      id: 'sma50',
      label: 'SMA 50 Distance (%)',
      value: [filters.sma50Min, filters.sma50Max],
      min: -50,
      max: 50,
      selector: 'slider',
    },
  ];

  return { descriptive, fundamental, technical };
};
