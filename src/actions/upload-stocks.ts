"use server";

import { db } from "@/lib/db";
import { FMP, FMP_API_URL } from "@/config/fmp/config";
import { env } from "@/env.mjs";
import pino from "pino";
import { getUser } from "@/lib/auth";
import { Stock } from "@prisma/client";
import { getSymbols } from "@/lib/fmp/get-symbols";

/**
 * Uploads descriptive stock data to the database.
 * @returns Status message for upload.
 */
export const uploadStocks = async () => {
  const user = await getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (user?.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const start = Date.now();
  const symbols = await getSymbols();
  if (!symbols?.length) {
    return new Response("Symbol Array could not be fetched.", { status: 500 });
  }

  pino().info(
    `uploadStocks: Initializing stock upload for ${symbols.length} symbols...`,
  );

  // Splitting symbols into batches with length of FMP.docsPerPull
  const symbolBatches = [];
  for (let i = 0; i < symbols.length; i += Number(FMP.docsPerPull)) {
    symbolBatches.push(symbols.slice(i, i + Number(FMP.docsPerPull)));
  }

  let uploadedSymbols = 0;
  await Promise.all(
    symbolBatches.map(async (symbolsBatch) => {
      try {
        const symbolsBatchString = symbolsBatch.join(",");
        const [profileData, stockPeerData] = await Promise.all([
          fetch(
            `${FMP_API_URL}v3/profile/${symbolsBatchString}?apikey=${env.FMP_API_KEY}`,
            { cache: "no-cache" },
          ).then((res) => res.json()),
          fetch(
            `${FMP_API_URL}v4/stock_peers?symbol=${symbolsBatchString}&apikey=${env.FMP_API_KEY}`,
            { cache: "no-cache" },
          ).then((res) => res.json()),
        ]);

        if (!profileData) {
          throw new Error(
            "uploadStocks: Failed to fetch profile and stock peer data.",
          );
        }

        const upserts = profileData
          .map((data: Stock) => {
            try {
              const newStock = {
                ...data,
                peersList:
                  stockPeerData
                    .find((p: any) => p.symbol === data.symbol)
                    ?.peersList?.join(",") ?? "",
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

              if (!newStock.companyName) {
                return;
              }

              return db.stock.upsert({
                select: {
                  id: true,
                  symbol: true,
                  financials: true,
                },
                where: { symbol: data.symbol },
                update: newStock,
                create: newStock,
              });
            } catch (err: any) {
              pino().error(
                `uploadStocks: Data preparation for ${data.symbol} failed.`,
              );
            }
          })
          .filter(Boolean);

        try {
          const results = await db.$transaction(upserts);
          pino().info(
            `uploadStocks: Uploaded stock batch containing ${results.length} stocks.`,
          );
          uploadedSymbols += results.length;
        } catch (err: any) {
          pino().error(
            `uploadStocks: Transaction error for batch ${symbolsBatch[0]}: ${err.message}`,
          );
        }
      } catch (err: any) {
        pino().error(
          `uploadStocks: Error for batch ${symbolsBatch[0]}: ${err.message}`,
        );
      }
    }),
  ).then(async () => {
    // Clean up faulty stock entries
    const deleted = await db.stock.deleteMany({
      where: { errorMessage: { not: null } },
    });

    pino().info(
      `uploadStocks: Database cleared: Deleted ${deleted.count} stock/s.`,
    );
  });

  const end = Date.now() - start;
  pino().info(
    `uploadStocks: Uploaded ${uploadedSymbols} stocks in ${(end / 1000).toFixed(
      0,
    )}s.`,
  );

  return { success: "Stocks uploaded." };
};
