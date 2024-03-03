import { db } from "@/db";
import { getSymbols } from "@/lib/fmp/quote";
import pino from "pino";
import { uploadStocks } from "@/lib/fmp/upload-stocks";
import { getUser } from "@/lib/auth";
import { FMP } from "@/config/fmp/config";

// export const runtime = "edge";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const dbUser = await db.user.findFirst({
    select: { role: true },
    where: { id: user.id },
  });

  if (dbUser?.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  pino().info("Preparing symbols for stock upload...");

  const symbols = await getSymbols("All");
  if (!symbols?.length) {
    return new Response("Symbol Array could not be fetched.", { status: 500 });
  }

  try {
    pino().info(`Initializing stock upload for ${symbols.length} symbols...`);

    // Splitting symbols into batches with length of FMP.docsPerPull
    const symbolBatches = [];
    for (let i = 0; i < symbols.length; i += Number(FMP.bulkCount)) {
      symbolBatches.push(symbols.slice(i, i + Number(FMP.bulkCount)));
    }

    for (const [i, symbolsBatch] of symbolBatches.entries()) {
      await uploadStocks(symbolsBatch).then(() => {
        pino().info(
          `Uploaded ${symbols.length} stocks (incl. '${symbols[0] ?? "N/A"}'.`
        );
      });
    }
  } catch (err: any) {
    pino().error(`Failed uploading stocks: ${err.message}`);
  }

  // Clean up faulty stock entries
  const deleted = await db.stock.deleteMany({
    where: { errorMessage: { not: null } },
  });

  pino().info(`Database cleared: Deleted ${deleted.count} stock/s.`);

  return new Response("OK");
}
