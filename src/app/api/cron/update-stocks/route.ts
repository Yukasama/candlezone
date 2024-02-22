import { db } from "@/db";
import { getSymbols } from "@/lib/fmp/quote";
import pino from "pino";
import { uploadStocks } from "@/lib/fmp/upload-stocks";

// export const runtime = "edge";

export async function GET() {
  const PULL_TIMES = 200;
  const symbols = await getSymbols("All", PULL_TIMES);

  if (!symbols?.length) {
    return new Response("Symbol Array could not be fetched.", { status: 500 });
  }

  try {
    await uploadStocks(symbols);

    pino().info(
      `[SUCCESS] Uploaded ${symbols.length} stocks including: '${
        symbols[0] ?? symbols[1] ?? "N/A"
      }'.`
    );
  } catch (err: any) {
    pino().error(`uploadStocks: ${err.message}`);
  }

  // Clean up faulty stock entries
  const deleted = await db.stock.deleteMany({
    where: { errorMessage: { not: null } },
  });

  pino().info(
    `[SUCCESS] Database cleared: Deleted ${deleted.count} stock/stocks.`
  );

  return new Response("OK");
}
