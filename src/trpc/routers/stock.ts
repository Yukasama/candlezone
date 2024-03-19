import { publicProcedure, router } from "../trpc";
import { db } from "@/lib/db";
import { z } from "zod";
import { buildFilter } from "@/config/screener/build-filter";
import { HistorySchema, ScreenerSchema } from "@/lib/validators/stock";
import { History } from "@/types/stock";
import { fetchHistory } from "@/lib/fmp/history";

export const stockRouter = router({
  query: publicProcedure.input(ScreenerSchema).query(async ({ input }) => {
    const { cursor = 1, take = 10 } = input;

    const filter = buildFilter(input);
    const paginationSkip = (cursor - 1) * take;

    return await db.stock.findMany({
      select: {
        symbol: true,
        image: true,
        companyName: true,
        sector: true,
        country: true,
        peRatioTTM: true,
        mktCap: true,
      },
      where: filter,
      take: take,
      skip: paginationSkip,
      orderBy: { symbol: "asc" },
    });
  }),
  search: publicProcedure.input(z.string()).query(async ({ input: search }) => {
    return await db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        image: true,
        companyName: true,
      },
      where: {
        OR: [
          { symbol: { contains: search } },
          { companyName: { contains: search } },
        ],
      },
      take: 10,
    });
  }),
  history: publicProcedure.input(HistorySchema).query(async ({ input }) => {
    const { symbol, timeframe, allFields } = input;

    const data = await fetchHistory({ symbol, timeframe, allFields });
    return data as History[];
  }),
});
