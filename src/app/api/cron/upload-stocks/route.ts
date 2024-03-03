import { db } from "@/db";
import { getSymbols } from "@/lib/fmp/quote";
import pino from "pino";
import { uploadStocks } from "@/lib/fmp/upload-stocks";
import { getUser } from "@/lib/auth";

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

  pino().info("[INFO] Preparing symbols for stock upload...");

  const PULL_TIMES = 200;
  const symbols = await getSymbols("All", PULL_TIMES);

  if (!symbols?.length) {
    return new Response("Symbol Array could not be fetched.", { status: 500 });
  }

  try {
    pino().info(
      `[INFO] Initializing stock upload for ${symbols.length} symbols...`
    );

    await uploadStocks(symbols).then(() => {
      pino().info(
        `[SUCCESS] Uploaded ${symbols.length} stocks including: '${
          symbols[0] ?? symbols[1] ?? "N/A"
        }'.`
      );
    });
  } catch (err: any) {
    pino().error(`[ERROR] Failed uploading stocks: ${err.message}`);
  }

  // Clean up faulty stock entries
  const deleted = await db.stock.deleteMany({
    where: { errorMessage: { not: null } },
  });

  pino().info(`[SUCCESS] Database cleared: Deleted ${deleted.count} stock/s.`);

  return new Response("OK");
}
