import "server-only";

import { History } from "@/types/stock";
import { db } from "@/lib/db";
import pino from "pino";
import { FMP_API_URL, TIMEFRAMES } from "@/config/fmp/config";

interface Props {
  symbol: string;
  timeframe: string;
  from?: Date;
  allFields?: boolean;
}

export async function fetchHistory({
  symbol,
  timeframe,
  from,
  allFields,
}: Props) {
  const { url, limit } = TIMEFRAMES[timeframe];

  const result = await fetch(constructHistoryUrl(symbol, url, from)).then(
    (res) => res.json()
  );

  const data = url.includes("price-full") ? result.historical : result;
  const history = data
    .slice(0, data.length < limit ? data.length : limit)
    .reverse();

  if (allFields) {
    return history;
  }

  return history.map((item: History) => ({
    date: item.date,
    close: item.close,
  }));
}

export async function MergeHistory(portfolioId: string, timeframe: string) {
  const stocksInPortfolio = await db.stockInPortfolio.findMany({
    where: { portfolioId },
    select: {
      createdAt: true,
      stock: {
        select: { symbol: true },
      },
    },
  });

  pino().trace("MergeHistory: stocksInPortfolio:", stocksInPortfolio);

  const data = await Promise.all(
    stocksInPortfolio.map((stock) =>
      fetchHistory({
        symbol: stock.stock.symbol,
        timeframe,
        from: stock.createdAt,
      })
    )
  );

  let result: any = {};

  // Merging history into average
  data.forEach((symbolData, i) => {
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

  pino().trace("MergeHistory:", result);
  return result;
}

export function constructHistoryUrl(symbol: string, url: string, from?: Date) {
  return `${FMP_API_URL}v3/${url}/${symbol}?${
    url.includes("price-full")
      ? "from=1975-01-01"
      : from && `from=${from.toDateString().split("T")[0]}`
  }&apikey=${process.env.FMP_API_KEY}`;
}
