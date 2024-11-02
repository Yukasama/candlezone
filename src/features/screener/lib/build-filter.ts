import { ScreenerProps } from '@/features/screener/lib/validators';
import { Prisma } from '@prisma/client';
import { marketCapMapping } from '../config/filter-values';
import { applyTextFilter } from './apply-filter';

export const buildFilter = (screener: ScreenerProps) => {
  const filter: Prisma.StockWhereInput = {};

  if (screener.ticker) {
    filter.symbol = {
      startsWith: screener.ticker,
    };
  }

  if (screener.exchange) {
    applyTextFilter({
      value: screener.exchange,
      filter,
      filterProp: 'exchangeShortName',
    });
  }

  if (screener.sector) {
    applyTextFilter({ value: screener.sector, filter, filterProp: 'sector' });
  }

  if (screener.industry) {
    applyTextFilter({
      value: screener.industry,
      filter,
      filterProp: 'industry',
    });
  }

  if (screener.country) {
    applyTextFilter({ value: screener.country, filter, filterProp: 'country' });
  }

  if (screener.mktCap && screener.mktCap in marketCapMapping) {
    filter.mktCap = {
      gte: marketCapMapping[screener.mktCap as keyof typeof marketCapMapping],
    };
  }

  if (screener.peRatioMin !== undefined || screener.peRatioMax !== undefined) {
    filter.peRatioTTM = {};
    if (screener.peRatioMin !== undefined) {
      filter.peRatioTTM.gte = screener.peRatioMin;
    }
    if (screener.peRatioMax !== undefined) {
      filter.peRatioTTM.lte = screener.peRatioMax;
    }
  }

  if (
    screener.pegRatioMin !== undefined ||
    screener.pegRatioMax !== undefined
  ) {
    filter.pegRatioTTM = {};
    if (screener.pegRatioMin !== undefined) {
      filter.pegRatioTTM.gte = screener.pegRatioMin;
    }
    if (screener.pegRatioMax !== undefined) {
      filter.pegRatioTTM.lte = screener.pegRatioMax;
    }
  }

  return filter;
};
