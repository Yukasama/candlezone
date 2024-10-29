import { ScreenerProps } from '@/features/screener/lib/validators';
import { Prisma } from '@prisma/client';
import { marketCapMapping } from '../config/filter-values';
import { applyTextFilter } from './apply-filter';

export const buildFilter = (screener: ScreenerProps) => {
  const filter: Prisma.StockWhereInput = {};

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

  if (screener.peRatioMin || screener.peRatioMax) {
    filter.peRatioTTM = {};
    if (screener.peRatioMin) {
      filter.peRatioTTM.gte = Number.parseFloat(screener.peRatioMin);
    }
    if (screener.peRatioMax) {
      filter.peRatioTTM.lte = Number.parseFloat(screener.peRatioMax);
    }
  }

  if (screener.pegRatioMin || screener.pegRatioMax) {
    filter.pegRatioTTM = {};
    if (screener.pegRatioMin) {
      filter.pegRatioTTM.gte = Number.parseFloat(screener.pegRatioMin);
    }
    if (screener.pegRatioMax) {
      filter.pegRatioTTM.lte = Number.parseFloat(screener.pegRatioMax);
    }
  }

  return filter;
};
