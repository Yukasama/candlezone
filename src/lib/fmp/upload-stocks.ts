import "server-only";

import { db } from "@/db";
import { FMP, FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";
import { uploadFinancials } from "./upload-financials";
import { Timeout } from "../utils";

export async function uploadStocks(symbols: string[]) {
  if (!symbols.length) {
    throw new Error("No symbols provided.");
  }

  const [profileData, stockPeerData] = await Promise.all([
    fetch(`${FMP_API_URL}v3/profile/${symbols}?apikey=${env.FMP_API_KEY}`).then(
      (res) => res.json()
    ),
    fetch(
      `${FMP_API_URL}v4/stock_peers?symbol=${symbols}&apikey=${env.FMP_API_KEY}`
    ).then((res) => res.json()),
  ]);

  // Splitting symbols into batches with length of FMP.docsPerPull
  const symbolBatches = [];
  for (let i = 0; i < symbols.length; i += Number(FMP.docsPerPull)) {
    symbolBatches.push(symbols.slice(i, i + Number(FMP.docsPerPull)));
  }

  symbolBatches.forEach(async (symbols, i) => {
    await fetchStockBatch(symbols, [profileData, stockPeerData]).catch(
      (err) => {
        throw new Error(`uploadStocks: ${err.message}`);
      }
    );

    // FMP API has a limit of 300 requests per minute
    if (i !== symbolBatches.length) {
      await Timeout(Number(FMP.timeout));
    }
  });
}

const fetchStockBatch = async (symbols: string[], profileData: any[]) => {
  const urlsPerSymbol = symbols.map((symbol) => [
    `${FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v4/price-target-consensus?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
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
          ...profileData[0].find(
            (profile: any) => profile.symbol === stock.symbol
          ),
          peersList:
            profileData[1]
              .find((profile: any) => profile.symbol === stock.symbol)
              .peersList.join(",") ?? "",
          ...stock,
          errorMessage: stock["Error Message"],
          price: undefined,
          volAvg: undefined,
          lastDiv: undefined,
          changes: undefined,
          phone: undefined,
          ipoDate: undefined,
          defaultImage: undefined,
          isAdr: undefined,
        };

        const insertedStock = await db.stock.upsert({
          select: { id: true, symbol: true, financials: true },
          where: { symbol: stock.symbol },
          update: newStock,
          create: newStock,
        });

        if (!insertedStock.financials.length) {
          await uploadFinancials(insertedStock, true);
        }
      } catch (err: any) {
        throw new Error(
          `[ERROR] uploadStocks (${stock.symbol}): ${err.message}`
        );
      }
    })
  );
};
