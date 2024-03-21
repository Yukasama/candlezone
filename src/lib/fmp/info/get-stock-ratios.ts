import { db } from "@/lib/db";
import { FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";
import pino from "pino";

/**
 * Fetches stock data from the Financial Modeling Prep API and adds it to the database.
 * @param symbol Symbol to return and add to the database.
 * @returns Stock object from the database.
 */
export async function getStockRatios(symbol: string) {
  if (!symbol) {
    throw new Error("No symbol provided.");
  }

  if (symbol.length < 0 || symbol.length > 6 || !/^[a-zA-Z.-]+$/.test(symbol)) {
    throw new Error("Symbol not valid.");
  }

  const stockDb = await db.stock.findFirst({
    include: { financials: true },
    where: { symbol },
  });

  if (!stockDb) {
    return null;
  }

  const twoHoursAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 2);
  if (stockDb.updatedAt > twoHoursAgo) {
    return stockDb;
  }

  const entries = !stockDb.financials.length ? 120 : 1;
  const [ratiosTTM, ratios] = await Promise.all([
    fetch(`${FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`, {
      cache: "no-cache",
    }).then((res) => res.json()),
    fetch(
      `${FMP_API_URL}v3/ratios/${symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
      { cache: "no-cache" }
    ).then((res) => res.json()),
  ]);

  const stock = {
    symbol,
    companyName: stockDb.companyName,
    image: stockDb.image,
    ...ratiosTTM[0],
    errorMessage: ratios[0]["Error Message"],
    price: undefined,
    volAvg: undefined,
    lastDiv: undefined,
    changes: undefined,
    phone: undefined,
    ipoDate: undefined,
    defaultImage: undefined,
    isAdr: undefined,
    targetHigh: undefined,
    targetLow: undefined,
    targetConsensus: undefined,
    targetMedian: undefined,
  };

  const stockUpsert = db.stock.upsert({
    where: { symbol },
    update: stock,
    create: stock,
  });

  const linkedFinancials = ratios.map((financial: any) => ({
    ...financial,
    stockId: stockDb.id,
    errorMessage: financial["Error Message"] ?? null,
    priceToBookRatio: undefined,
    acceptedDate: undefined,
    link: undefined,
    finalLink: undefined,
  }));

  const financialInserts =
    entries === 1
      ? db.financials.upsert({
          where: {
            stockId_calendarYear: {
              stockId: stockDb.id,
              calendarYear: linkedFinancials[0].calendarYear,
            },
          },
          update: linkedFinancials[0],
          create: linkedFinancials[0],
        })
      : db.financials.createMany({
          data: linkedFinancials,
        });

  const upsert = await db.$transaction([stockUpsert, financialInserts]);
  pino().info({ stock: upsert[0].symbol }, "Stock inserted");

  return {
    ...upsert[0],
    financials: upsert[1],
  };
}
