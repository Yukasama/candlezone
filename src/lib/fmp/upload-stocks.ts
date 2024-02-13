import "server-only";

import { db } from "@/db";
import { FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";

export async function uploadStocks(symbols: string[]) {
  if (!symbols.length) {
    throw new Error("No symbols provided.");
  }

  const urlsPerSymbol = symbols.map((symbol) => [
    `${FMP_API_URL}v3/profile/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/key-metrics-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v4/price-target-consensus?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v4/stock_peers?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
  ]);

  const stocks = await Promise.all(
    urlsPerSymbol.map(async (urls) => {
      try {
        const responses = await Promise.all(
          urls.map(
            async (url) =>
              await fetch(url, { cache: "no-cache" }).then((res) => res.json())
          )
        );

        return responses
          .flat()
          .reduce((acc, data) => ({ ...acc, ...data }), {});
      } catch (err: any) {
        throw new Error(
          `[ERROR] uploadStocks: Data preparation failed. => ${err.message}`
        );
      }
    })
  );

  await Promise.all(
    stocks.map(async (stock) => {
      try {
        const newStock = {
          ...stock,
          peersList: stock.peersList?.join(",") ?? "",
          errorMessage: stock["Error Message"],
        };

        await db.stock.upsert({
          where: { symbol: stock.symbol },
          update: newStock,
          create: newStock,
        });
      } catch (err: any) {
        throw new Error(
          `[ERROR] uploadStocks (${stock.symbol}): ${err.message}`
        );
      }
    })
  );
}
