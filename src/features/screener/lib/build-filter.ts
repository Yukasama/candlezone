import { ScreenerProps } from '@/features/screener/lib/validators';
import { Prisma } from '@prisma/client';
import { marketCapMapping } from '../config/filter-values';

export const buildFilter = (screener: ScreenerProps) => {
  const filter: Prisma.StockWhereInput = {};

  if (screener.symbol) {
    filter.symbol = { startsWith: screener.symbol };
  }

  if (screener.exchange) {
    filter.exchangeShortName = { equals: screener.exchange };
  }

  if (screener.sector) {
    filter.sector = { equals: screener.sector };
  }

  if (screener.industry) {
    filter.industry = { equals: screener.industry };
  }

  if (screener.country) {
    filter.country = { equals: screener.country };
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
