import { db } from "@/db";
import { FMP } from "@/config/fmp/config";
import { getSymbols } from "@/lib/fmp/quote";
import { Timeout } from "@/lib/utils";
import pino from "pino";
import { uploadFinancials } from "@/lib/fmp/upload-financials";

// export const runtime = "edge";

export async function GET() {
  const PULL_TIMES = 200;
  const symbolArray = await getSymbols("All", PULL_TIMES);

  if (!symbolArray?.length) {
    return new Response("Symbol Array could not be fetched.", { status: 500 });
  }

  let currentIteration = 0;
  symbolArray.forEach(async (symbols) => {
    ++currentIteration;

    if (symbols.length) {
      try {
        await uploadFinancials(symbols);

        pino().info(
          `[SUCCESS] Uploaded financials from ${
            symbols.length
          } symbols including: '${symbols[0] ?? symbols[1] ?? "N/A"}'.`
        );
      } catch (err: any) {
        pino().error(`uploadFinancials: ${err.message}`);
      }
    }

    // FMP API has a limit of 300 requests per minute
    if (currentIteration !== symbolArray.length) {
      await Timeout(Number(FMP.timeout));
    }
  });

  // Clean up faulty financial entries
  const deleted = await db.financials.deleteMany({
    where: { errorMessage: { not: null } },
  });

  pino().info(
    `[SUCCESS] Database cleared: Deleted ${deleted.count} financials.`
  );

  return new Response("OK");
}
