import { Prisma } from "@prisma/client";
import { ScreenerProps } from "@/lib/validators/stock";

export function buildFilter(screener: ScreenerProps) {
  const filter: Prisma.StockWhereInput = {};

  if (screener.exchange && screener.exchange !== "Any") {
    filter.exchangeShortName = screener.exchange;
  }

  if (screener.sector && screener.sector !== "Any") {
    filter.sector = screener.sector;
  }

  if (screener.industry && screener.industry !== "Any") {
    filter.industry = screener.industry;
  }

  if (screener.country && screener.country !== "Any") {
    filter.country = screener.country;
  }

  if (screener.mktCap && screener.mktCap !== "Any") {
    const marketCapMapping: any = {
      "Mega (100 Bil.)": 100_000_000_000,
      "Large (10 Bil.)": 10_000_000_000,
      "Medium (1 Bil.)": 1_000_000_000,
      "Small (50 Mil.)": 50_000_000,
    };

    if (screener.mktCap in marketCapMapping) {
      filter.mktCap = { gte: marketCapMapping[screener.mktCap] };
    }
  }

  if (
    screener.peRatio ||
    (screener.peRatio[0] === "Any" && screener.peRatio[1] === "Any")
  ) {
    const [left, right] = screener.peRatio;
    let peRatioFilter: Prisma.FloatNullableFilter | undefined;

    if (left === ">50") {
      peRatioFilter = { lt: 50 };
    } else if (right === ">50") {
      peRatioFilter = { gt: 50 };
    } else if (left !== "Any" && right !== "Any") {
      peRatioFilter = {
        lte: parseFloat(left),
        gte: parseFloat(right),
      };
    } else if (left !== "Any") {
      peRatioFilter = { lte: Number(left) };
    } else if (right !== "Any") {
      peRatioFilter = { gte: Number(right) };
    }

    if (peRatioFilter) {
      filter.peRatioTTM = peRatioFilter;
    }
  }

  if (
    screener.pegRatio ||
    (screener.pegRatio[0] === "Any" && screener.pegRatio[1] === "Any")
  ) {
    const [left, right] = screener.pegRatio;
    let pegRatioFilter: Prisma.FloatNullableFilter | undefined;

    if (left === ">10") {
      pegRatioFilter = { lt: 10 };
    } else if (right === ">10") {
      pegRatioFilter = { gt: 10 };
    } else if (left !== "Any" && right !== "Any") {
      pegRatioFilter = {
        lte: Number(left),
        gte: Number(right),
      };
    } else if (left !== "Any") {
      pegRatioFilter = { lte: Number(left) };
    } else if (right !== "Any") {
      pegRatioFilter = { gte: Number(right) };
    }

    if (pegRatioFilter) {
      filter.pegRatioTTM = pegRatioFilter;
    }
  }

  return filter;
}
