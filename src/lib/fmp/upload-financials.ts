import "server-only";

import { db } from "@/db";
import { FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";

export async function uploadFinancials(symbols: string[]) {
  if (!symbols?.length) {
    throw new Error("No symbols provided.");
  }

  const inDb = await db.stock.findMany({
    select: { id: true, symbol: true, financials: true },
  });

  const financialUrls = inDb.map((symbol) => [
    `${FMP_API_URL}v3/income-statement/${symbol}?limit=${
      !symbol.financials?.length ? 120 : 1
    }&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/balance-sheet-statement/${symbol}?limit=${
      !symbol.financials?.length ? 120 : 1
    }&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/cash-flow-statement/${symbol}?limit=${
      !symbol.financials?.length ? 120 : 1
    }&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/ratios/${symbol}?limit=${
      !symbol.financials?.length ? 120 : 1
    }&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/key-metrics/${symbol}?limit=${
      !symbol.financials?.length ? 120 : 1
    }&apikey=${env.FMP_API_KEY}`,
  ]);

  const financials = await Promise.allSettled(
    financialUrls.map(
      async (urls) =>
        await Promise.all(
          urls
            .map(
              async (url) =>
                await fetch(url, { cache: "no-cache" })
                  .then((res) => res.json())
                  .catch(() => null)
            )
            .filter((obj) => obj !== null)
        )
    )
  );

  const combinedData = financials
    .filter((result) => result.status === "fulfilled")
    .map((result: any) => MergeData(result.value));

  await Promise.all(
    combinedData.map(async (symbol) => {
      try {
        const statementsByYear = symbol.reduce((acc, statement) => {
          const year = statement.date.split("-")[0];

          if (!acc[year]) {
            acc[year] = [];
          }

          acc[year].push(statement);

          return acc;
        }, {});

        await Promise.all(
          Object.entries(statementsByYear).map(async ([year, statements]) => {
            const stockId = inDb.find(
              (stock) => stock.symbol === statements.symbol
            )?.id;

            if (stockId) {
              try {
                const financialData = {
                  ...statements[0],
                  stockId,
                  errorMessage: statements[0]["Error Message"],
                };

                await db.financials.upsert({
                  where: {
                    stockId_calendarYear: {
                      stockId,
                      calendarYear: year,
                    },
                  },
                  update: financialData,
                  create: financialData,
                });
              } catch (error: any) {
                throw new Error(
                  `[ERROR] uploadStocks: ${symbol}, ${year}": ${error.message}`
                );
              }
            }
          })
        );
      } catch (error: any) {
        throw new Error(`[ERROR] uploadStocks: ${symbol}: ${error.message}`);
      }
    })
  );
}

function MergeData(arrays: Record<string, any>[][]): Record<string, any>[] {
  const isArrayofArrays =
    Array.isArray(arrays) && arrays.every((array) => Array.isArray(array));

  if (!isArrayofArrays) {
    return [];
  }

  const result: Record<string, any>[] = [];

  for (const array of arrays) {
    if (!array.every((item) => typeof item === "object" && item.date)) {
      throw new Error(
        "Each sub-array must contain objects with a 'date' property."
      );
    }

    for (const item of array) {
      const existingItem = result.find((i) => i.date === item.date);

      if (existingItem) {
        Object.assign(existingItem, item);
      } else {
        result.push(item);
      }
    }
  }

  return result;
}
