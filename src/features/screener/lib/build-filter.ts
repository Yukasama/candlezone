import { ScreenerProps } from '@/features/stock/lib/validators';
import { Prisma } from '@prisma/client';
import { marketCapMapping, peRatios, pegRatios } from '../config/filters';
import { applyNumericFilter, applyTextFilter } from './apply-filter';

export const buildFilter = (screener: ScreenerProps) => {
  const filter: Prisma.StockWhereInput = {};

  applyTextFilter({
    value: screener.exchange,
    filter,
    filterProp: 'exchangeShortName',
  });

  applyTextFilter({ value: screener.sector, filter, filterProp: 'sector' });

  applyTextFilter({ value: screener.industry, filter, filterProp: 'industry' });

  applyTextFilter({ value: screener.country, filter, filterProp: 'country' });

  if (screener.mktCap !== 'Any' && screener.mktCap in marketCapMapping) {
    filter.mktCap = {
      gte: marketCapMapping[screener.mktCap as keyof typeof marketCapMapping],
    };
  }

  applyNumericFilter({
    values: screener.peRatio,
    selectionSpan: peRatios,
    filter,
    filterProp: 'peRatioTTM',
  });

  applyNumericFilter({
    values: screener.pegRatio,
    selectionSpan: pegRatios,
    filter,
    filterProp: 'pegRatioTTM',
  });

  return filter;
};
