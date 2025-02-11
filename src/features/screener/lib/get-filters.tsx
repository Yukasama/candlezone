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
} from '../config/filter-values';

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
      options: exchanges,
      selector: 'select',
      value: filters.exchange,
    },
    {
      id: 'country',
      label: 'Country',
      optionLabels: countries,
      options: Object.keys(countries),
      selector: 'select',
      value: filters.country ?? 'Any',
    },
    {
      id: 'sector',
      label: 'Sector',
      options: sectors,
      selector: 'select',
      value: filters.sector,
    },
    {
      id: 'industry',
      label: 'Industry',
      options: industries,
      selector: 'select',
      value: filters.industry,
    },
    {
      id: 'earningsDate',
      label: 'Earnings Date',
      options: earningsDates,
      selector: 'select',
      value: filters.earningsDate,
    },
    {
      id: 'marketCap',
      label: 'Market Cap',
      options: Object.keys(marketCaps),
      selector: 'select',
      value: filters.marketCap,
    },
  ];

  const fundamental = [
    {
      id: 'peRatio',
      label: 'P/E Ratio',
      max: peRatioRange[1],
      min: peRatioRange[0],
      selector: 'slider',
      value: [filters.peRatioMin, filters.peRatioMax],
    },
    {
      id: 'pegRatio',
      label: 'PEG Ratio',
      max: pegRatioRange[1],
      min: pegRatioRange[0],
      selector: 'slider',
      value: [filters.pegRatioMin, filters.pegRatioMax],
    },
    {
      id: 'grossMargin',
      label: 'Gross Margin (%)',
      max: grossMarginRange[1],
      min: grossMarginRange[0],
      selector: 'slider',
      value: [filters.grossMarginMin, filters.grossMarginMax],
    },
    {
      id: 'netMargin',
      label: 'Net Margin (%)',
      max: netMarginRange[1],
      min: netMarginRange[0],
      selector: 'slider',
      value: [filters.netMarginMin, filters.netMarginMax],
    },
  ];

  const technical = [
    {
      id: 'sma50',
      label: 'SMA 50 Distance (%)',
      max: sma50Range[1],
      min: sma50Range[0],
      selector: 'slider',
      value: [filters.sma50Min, filters.sma50Max],
    },
  ];

  return { descriptive, fundamental, technical };
};
