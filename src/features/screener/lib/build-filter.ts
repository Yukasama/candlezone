import { ScreenerProps } from '@/features/screener/lib/validators';
import type { Prisma } from '@prisma/client';
import { marketCaps } from '../config/filter-values';
import { getEarningsDateRange } from './earnings-date';

export const buildFilter = (screener: ScreenerProps) => {
  const filter: Prisma.StockWhereInput = {};

  if (screener.symbol) {
    filter.symbol = { startsWith: screener.symbol };
  }

  if (screener.exchange) {
    filter.exchange = { equals: screener.exchange };
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

  if (screener.marketCap && screener.marketCap in marketCaps) {
    filter.marketCap = {
      gte: marketCaps[screener.marketCap as keyof typeof marketCaps],
    };
  }

  if (screener.peRatioMin ?? screener.peRatioMax) {
    filter.priceToEarningsRatioTTM = {};
    if (screener.peRatioMin) {
      filter.priceToEarningsRatioTTM.gte = screener.peRatioMin;
    }
    if (screener.peRatioMax) {
      filter.priceToEarningsRatioTTM.lte = screener.peRatioMax;
    }
  }

  if (screener.pegRatioMin ?? screener.pegRatioMax) {
    filter.priceToEarningsGrowthRatioTTM = {};
    if (screener.pegRatioMin) {
      filter.priceToEarningsGrowthRatioTTM.gte = screener.pegRatioMin;
    }
    if (screener.pegRatioMax) {
      filter.priceToEarningsGrowthRatioTTM.lte = screener.pegRatioMax;
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

  if (screener.earningsDate) {
    const dateRange = getEarningsDateRange({ filter: screener.earningsDate });
    if (dateRange) {
      filter.earningsDate = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }
  }

  return filter;
};
