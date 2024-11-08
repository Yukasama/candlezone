import {
  ScreenerProps,
  ScreenerSchema,
} from '@/features/screener/lib/validators';
import {
  countries,
  exchanges,
  industries,
  sectors,
} from '@/lib/fmp/data/filters';
import { ReadonlyURLSearchParams } from 'next/navigation';
import {
  earningsDates,
  grossMarginRange,
  marketCaps,
  netMarginRange,
  pegRatioRange,
  peRatioRange,
  sma50Range,
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
      value: filters.country ?? 'Any',
      options: Object.keys(countries),
      optionLabels: countries,
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
      options: Object.keys(marketCaps),
      selector: 'select',
    },
  ];

  const fundamental = [
    {
      id: 'peRatio',
      label: 'P/E Ratio',
      value: [filters.peRatioMin, filters.peRatioMax],
      min: peRatioRange[0],
      max: peRatioRange[1],
      selector: 'slider',
    },
    {
      id: 'pegRatio',
      label: 'PEG Ratio',
      value: [filters.pegRatioMin, filters.pegRatioMax],
      min: pegRatioRange[0],
      max: pegRatioRange[1],
      selector: 'slider',
    },
    {
      id: 'grossMargin',
      label: 'Gross Margin (%)',
      value: [filters.grossMarginMin, filters.grossMarginMax],
      min: grossMarginRange[0],
      max: grossMarginRange[1],
      selector: 'slider',
    },
    {
      id: 'netMargin',
      label: 'Net Margin (%)',
      value: [filters.netMarginMin, filters.netMarginMax],
      min: netMarginRange[0],
      max: netMarginRange[1],
      selector: 'slider',
    },
  ];

  const technical = [
    {
      id: 'sma50',
      label: 'SMA 50 Distance (%)',
      value: [filters.sma50Min, filters.sma50Max],
      min: sma50Range[0],
      max: sma50Range[1],
      selector: 'slider',
    },
  ];

  return { descriptive, fundamental, technical };
};
