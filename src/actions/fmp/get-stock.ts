import { db } from "@/lib/db";
import { FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";
import pino from "pino";

/**
 * Fetches stock data from the Financial Modeling Prep API and adds it to the database.
 * @param symbol Symbol to return and add to the database.
 * @param isNew Stock isn't in the database yet, stock peers will also be fetched.
 * @returns Stock object from the database.
 */
export async function getStock(symbol: string, isNew: boolean = false) {
  if (!symbol) {
    throw new Error("No symbol provided.");
  }

  if (symbol.length < 0 || symbol.length > 6 || !/^[a-zA-Z.-]+$/.test(symbol)) {
    throw new Error("Symbol not valid.");
  }

  const [profile, stockPeers, ratios] = await Promise.all([
    fetch(`${FMP_API_URL}v3/profile/${symbol}?apikey=${env.FMP_API_KEY}`, {
      cache: "no-cache",
    }).then((res) => res.json()),
    isNew &&
      fetch(
        `${FMP_API_URL}v4/stock_peers?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
        { cache: "no-cache" }
      ).then((res) => res.json()),
    fetch(`${FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`, {
      cache: "no-cache",
    }).then((res) => res.json()),
  ]);

  const stock = {
    ...ratios[0],
    ...profile[0],
    peersList: isNew ? stockPeers?.peersList?.join(",") ?? "" : undefined,
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

  const insertedStock = await db.stock.upsert({
    where: { symbol },
    update: stock,
    create: stock,
  });

  pino().info({ stock: insertedStock.symbol }, "Stock inserted");

  return insertedStock;
}
