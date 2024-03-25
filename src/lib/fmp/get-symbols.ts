import "server-only";
import { FMP, FMP_URLS } from "@/config/fmp/config";

export const getSymbols = async () => {
  if (FMP.simulation) {
    return ["AAPL", "MSFT", "GOOG", "TSLA", "NVDA", "META"];
  }

  const data = await fetch(FMP_URLS["All"], { cache: "no-cache" }).then((res) =>
    res.json()
  );

  return data
    .filter(
      (stock: any) => stock.type === "stock" && stock.exchange !== "EURONEXT"
    )
    .map((stock: any) => stock.symbol);
};
