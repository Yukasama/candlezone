import { ScreenerProps } from '@/features/screener/lib/validators';
import { Prisma } from '@prisma/client';
import { marketCaps } from '../config/filter-values';

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

  if (screener.mktCap && screener.mktCap in marketCaps) {
    filter.mktCap = {
      gte: marketCaps[screener.mktCap as keyof typeof marketCaps],
    };
  }

  if (screener.peRatioMin ?? screener.peRatioMax) {
    filter.peRatioTTM = {};
    if (screener.peRatioMin) {
      filter.peRatioTTM.gte = screener.peRatioMin;
    }
    if (screener.peRatioMax) {
      filter.peRatioTTM.lte = screener.peRatioMax;
    }
  }

  if (screener.pegRatioMin ?? screener.pegRatioMax) {
    filter.pegRatioTTM = {};
    if (screener.pegRatioMin) {
      filter.pegRatioTTM.gte = screener.pegRatioMin;
    }
    if (screener.pegRatioMax) {
      filter.pegRatioTTM.lte = screener.pegRatioMax;
    }
  }

  if (screener.grossMarginMin ?? screener.grossMarginMax) {
    filter.grossProfitMarginTTM = {};
    if (screener.grossMarginMin) {
      filter.grossProfitMarginTTM.gte = Number(screener.grossMarginMin) / 100;
    }
    if (screener.grossMarginMax) {
      filter.grossProfitMarginTTM.lte = Number(screener.grossMarginMax) / 100;
    }
  }

  if (screener.netMarginMin ?? screener.netMarginMax) {
    filter.netProfitMarginTTM = {};
    if (screener.netMarginMin) {
      filter.netProfitMarginTTM.gte = Number(screener.netMarginMin) / 100;
    }
    if (screener.netMarginMax) {
      filter.netProfitMarginTTM.lte = Number(screener.netMarginMax) / 100;
    }
  }

  return filter;
};
