import { db } from "@/db";
import { FMP } from "@/config/fmp/config";
import { TRPCError } from "@trpc/server";
import { getSymbols } from "@/lib/fmp/quote";
import { Timeout } from "@/lib/utils";
import { UploadStockSchema } from "@/lib/validators/stock";
import pino from "pino";
import { uploadStocks } from "@/lib/fmp/upload";

export async function POST(request: Request) {
  const { stock, skip, clean, pullTimes } = UploadStockSchema.parse(
    await request.json()
  );

  let alreadyInDb: string[] = [];

  if (skip) {
    const allStocks = await db.stock.findMany({
      select: { symbol: true },
    });

    alreadyInDb = allStocks.map((stock) => stock.symbol);
  }

  if (stock === "All" || stock === "US500") {
    const symbolArray = await getSymbols(stock, pullTimes);

    if (!symbolArray) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    const totalIterations = symbolArray.length;
    let currentIteration = 0;

    for (let symbols of symbolArray) {
      currentIteration++;
      symbols = symbols.filter((s) => s && s !== null && s !== undefined);

      if (skip) {
        symbols = symbols.filter((s) => !alreadyInDb.includes(s));
      }

      if (symbols.length === 0) {
        continue;
      }

      await uploadStocks(symbols, ctx.user);

      pino().info(
        `[SUCCESS] Uploaded ${symbols.length} stocks including: '${
          symbols[0] ?? symbols[1] ?? "undefined"
        }'`
      );

      // FMP API has a limit of 300 requests per minute
      if (currentIteration !== totalIterations) {
        await Timeout(Number(FMP.timeout));
      }
    }
  } else {
    await uploadStocks([stock], ctx.user);
  }

  if (clean) {
    const deleted = await db.stock.deleteMany({
      where: { errorMessage: { not: null } },
    });

    pino().info(
      `[SUCCESS] Database cleared. Deleted ${deleted.count} stock/stocks`
    );
  }

  return NextResponse.json({ ok: true });
}
