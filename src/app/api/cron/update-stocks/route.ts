import { db } from "@/db";
import { FMP } from "@/config/fmp/config";
import { getSymbols } from "@/lib/fmp/quote";
import { Timeout } from "@/lib/utils";
import pino from "pino";
import { uploadStocks } from "@/lib/fmp/upload";

// export const runtime = "edge";

export async function GET() {
  const PULL_TIMES = 200;

  const [alreadyInDb, symbolArray] = await Promise.all([
    db.stock
      .findMany({
        select: { symbol: true },
      })
      .then((stocks) => stocks.map((s) => s.symbol)),
    getSymbols("All", PULL_TIMES),
  ]);

  if (!symbolArray) {
    return new Response("Symbol Array not available.", { status: 500 });
  }

  let currentIteration = 0;
  symbolArray.forEach(async (item) => {
    ++currentIteration;

    const symbols = item.filter((s) => s && !alreadyInDb.includes(s));
    if (symbols.length) {
      await uploadStocks(symbols);
    }

    pino().info(
      `[SUCCESS] Uploaded ${symbols.length} stocks including: '${
        symbols[0] ?? symbols[1] ?? "N/A"
      }'.`
    );

    // FMP API has a limit of 300 requests per minute
    if (currentIteration !== symbolArray.length) {
      await Timeout(Number(FMP.timeout));
    }
  });

  // Clean up faulty stock entries
  const deleted = await db.stock.deleteMany({
    where: { errorMessage: { not: null } },
  });

  pino().info(
    `[SUCCESS] Database cleared: Deleted ${deleted.count} stock/stocks.`
  );

  return new Response("OK");
}
