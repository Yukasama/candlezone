import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { FMP, FMP_URLS } from "@/config/fmp/config";
import { QUOTE_SIMULATION } from "@/config/fmp/simulation";
import { Quote } from "@/types/stock";

export const fmpRouter = router({
  getDailys: publicProcedure
    .input(z.enum(["actives", "winners", "losers"]))
    .query(async ({ input: action }) => {
      if (FMP.simulation) {
        return [
          QUOTE_SIMULATION,
          QUOTE_SIMULATION,
          QUOTE_SIMULATION,
          QUOTE_SIMULATION,
          QUOTE_SIMULATION,
        ];
      }

      const response = await fetch(FMP_URLS[action], {
        next: { revalidate: 30 },
      }).then((res) => res.json());

      // Filtering all none-ETFs and stocks with "-" in their symbol
      const symbols = response.filter(
        (item: Quote) =>
          item.name &&
          !item.symbol.includes("-") &&
          !item.name.includes("ProShares")
      );

      return symbols;
    }),
});
