import "server-only";

import { db } from "@/db";
import { FMP, FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";
import { uploadFinancials } from "./upload-financials";
import { Timeout } from "../utils";
import pino from "pino";

export async function uploadStocks(symbols: string[]) {
  if (!symbols.length) {
    throw new Error("No symbols provided.");
  }

  const BULK_FETCH = 1700;
  const [profileData, stockPeerData] = await Promise.all([
    fetch(
      `${FMP_API_URL}v3/profile/${symbols.slice(0, BULK_FETCH)}?apikey=${
        env.FMP_API_KEY
      }`,
      { cache: "no-cache" }
    ).then((res) => res.json()),
    fetch(
      `${FMP_API_URL}v4/stock_peers?symbol=${symbols.slice(
        0,
        BULK_FETCH
      )}&apikey=${env.FMP_API_KEY}`,
      { cache: "no-cache" }
    ).then((res) => res.json()),
  ]);

  if (!profileData || !stockPeerData) {
    throw new Error("Failed to fetch profile and stock peer data.");
  }

  // Splitting symbols into batches with length of FMP.docsPerPull
  const symbolBatches = [];
  for (let i = 0; i < symbols.length; i += Number(FMP.docsPerPull)) {
    symbolBatches.push(symbols.slice(i, i + Number(FMP.docsPerPull)));
  }

  for (const [index, symbolsBatch] of symbolBatches.entries()) {
    await fetchStockBatch(symbolsBatch, [profileData, stockPeerData]).catch(
      (err) => pino().error(`fetchStockBatch: ${err.message}`)
    );

    // FMP API has a limit of 300 requests per minute
    if (index !== symbolBatches.length - 1) {
      await Timeout(Number(FMP.timeout));
    }
  }
}

const fetchStockBatch = async (symbols: string[], profileData: any[]) => {
  const urlsPerSymbol = symbols.map((symbol) => [
    `${FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
  ]);

  const stocks = await Promise.all(
    urlsPerSymbol.map(async (urls) => {
      try {
        const responses = await Promise.all(
          urls.map(
            async (url) =>
              await fetch(url, { cache: "no-cache" }).then((res) => {
                const result = res.json();
                return {
                  ...result,
                  symbol: extractSymbol(url),
                };
              })
          )
        );

        return responses
          .flat()
          .reduce((acc, data) => ({ ...acc, ...data }), {});
      } catch (err: any) {
        throw new Error(`(data preparation): ${err.message}`);
      }
    })
  );

  await Promise.all(
    stocks
      .filter((stock) => !stock.symbol)
      .map(async (stock) => {
        try {
          const newStock = {
            ...stock,
            ...profileData[0].find((p: any) => p.symbol === stock.symbol),
            peersList:
              profileData[1]
                .find((p: any) => p.symbol === stock.symbol)
                .peersList.join(",") ?? "",
            errorMessage: stock["Error Message"],
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
            select: {
              id: true,
              symbol: true,
              financials: true,
            },
            where: { symbol: stock.symbol },
            update: newStock,
            create: newStock,
          });

          if (!insertedStock.financials.length) {
            await uploadFinancials(insertedStock, true);
          }
        } catch (err: any) {
          throw new Error(`(data insert of ${stock.symbol}): ${err.message}`);
        }
      })
  );

  pino().info(`uploadStocks: Uploaded stock batch containing ${symbols[0]}.`);
};

function extractSymbol(url: string): string | null {
  const pattern = /ratios-ttm\/(.*?)\?apikey=/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}
