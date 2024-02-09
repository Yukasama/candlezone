import "server-only";

import { db } from "@/db";
import { FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";
import pino from "pino";

export async function uploadStocks(symbols: string[]) {
  if (!symbols.length) {
    throw new Error("No symbols provided.");
  }

  const financialUrls = symbols.map((symbol) => [
    `${FMP_API_URL}v3/income-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/balance-sheet-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/cash-flow-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/ratios/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/key-metrics/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
  ]);

  const profileUrls = symbols.map((symbol) => [
    `${FMP_API_URL}v3/profile/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/key-metrics-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v4/stock_peers?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
    //`${FMP_API_URL}v4/price-target-consensus?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
  ]);

  const responses = await Promise.allSettled(
    financialUrls.map(async (urls) => {
      const jsonObjects = await Promise.all(
        urls.map(async (url) => {
          try {
            return await fetch(url, { cache: "no-cache" }).then((res) =>
              res.json()
            );
          } catch {
            return undefined;
          }
        })
      );

      return jsonObjects.filter((obj) => obj !== undefined);
    })
  );

  const combinedData = responses.map((result) => {
    if (result.status === "fulfilled") {
      return MergeData(result.value);
    }

    return [];
  });

  const stocks = await Promise.all(
    profileUrls.map(async (urls) => {
      try {
        const responses = await Promise.all(
          urls.map(
            async (url) =>
              await fetch(url, { cache: "no-cache" }).then((res) => res.json())
          )
        );

        return responses.flat().reduce((acc, data) => {
          return { ...acc, ...data };
        }, {});
      } catch {
        return {};
      }
    })
  );

  const promises = symbols.map(async (symbol, i) => {
    try {
      const stock = {
        ...stocks[i],
        updatedAt: new Date(),
        peersList: stocks[i].peersList ? stocks[i].peersList.join(",") : "",
        errorMessage: stocks[i]["Error Message"],
        "Error Message": undefined,
      };

      const createdStock = await db.stock.upsert({
        where: { symbol },
        update: stock,
        create: {
          ...stock,
          createdAt: new Date(),
        },
      });

      const statementsByYear = combinedData[i].reduce((acc, statement) => {
        const year = statement.date.split("-")[0];

        if (!acc[year]) {
          acc[year] = [];
        }

        acc[year].push(statement);

        return acc;
      }, {});

      const financialsPromises = Object.entries(statementsByYear).map(
        async ([year, statements]) => {
          const financialData = {
            ...statements[0],
            updatedAt: new Date(),
            stockId: createdStock.id,
            errorMessage: statements[0]["Error Message"],
            "Error Message": undefined,
          };

          try {
            await db.financials.upsert({
              where: {
                stockId_calendarYear: {
                  stockId: createdStock.id,
                  calendarYear: year,
                },
              },
              update: financialData,
              create: {
                ...financialData,
                createdAt: new Date(),
              },
            });
          } catch (error: any) {
            pino().error(
              `[ERROR] uploadStocks: ${symbol}, ${year}": ${error.message}`
            );
          }
        }
      );

      await Promise.all(financialsPromises);
    } catch (error: any) {
      pino().error(`[ERROR] uploadStocks: ${symbol}: ${error.message}`);
    }
  });

  await Promise.all(promises);
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
