import "server-only";
import { db } from "@/lib/db";
import pino from "pino";
import { FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";

export async function getPortfolioHistory(
  portfolioId: string,
  timeframe: string
) {
  const stocksInPortfolio = await db.stockInPortfolio.findMany({
    select: {
      createdAt: true,
      quantity: true,
      stock: {
        select: { symbol: true },
      },
    },
    where: { portfolioId },
  });

  const symbols = stocksInPortfolio
    .map((stock) => stock.stock.symbol)
    .join(",");

  const data = await fetch(
    `${FMP_API_URL}v3/historical-price-full/${symbols}?apikey=${env.FMP_API_KEY}`
  ).then((res) => res.json());

  let result: any = {};

  // Merging history into average
  data.forEach((symbolData: any) => {
    Object.keys(symbolData).forEach((range) => {
      if (!result[range]) {
        result[range] = [];
      }

      symbolData[range].forEach((entry: any, i: any) => {
        if (!result[range][i]) {
          result[range][i] = {
            date: entry.date,
            close: 0,
            count: 0,
          };
        }

        // Check if entry has date after stock was added to portfolio
        const entryAddedAfter =
          new Date(entry.date) >=
          new Date(stocksInPortfolio[i].createdAt.toDateString().split("T")[0]);

        if (entryAddedAfter) {
          result[range][i].close += entry.close;
          result[range][i].count++;
        }
      });
    });
  });

  // Adjusting result to calculate average and exclude days with no data
  Object.keys(result).forEach((range) => {
    result[range] = result[range]
      .filter((entry: any) => entry.count > 0)
      .map((entry: any) => {
        return {
          date: entry.date,
          close: entry.close / entry.count,
        };
      });
  });

  pino().trace("getPortfolioHistory:", result);
  return result;
}
