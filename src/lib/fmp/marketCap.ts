"use server";

import { env } from "@/env.mjs";
import { getProfiles, getQuotes } from "./quote";
import { MarketCapQuote, MarketCapStock } from "@/types/stock";

export async function getMarketCap(): Promise<MarketCapQuote[] | undefined> {
  const orderedByMktCap: MarketCapStock[] = await fetch(
    `https://financialmodelingprep.com/api/v3/stock-screener?apikey=${env.FMP_API_KEY}`
  ).then((res) => res.json());

  const filteredData = orderedByMktCap
    .filter(
      (stock) =>
        !stock.isEtf &&
        !stock.isFund &&
        stock.symbol !== "GOOGL" &&
        stock.symbol !== "BRK.B"
    )
    .slice(0, 500);

  const [quotes, images] = await Promise.all([
    getQuotes(filteredData.map((stock: any) => stock.symbol)),
    getProfiles(filteredData.map((stock: any) => stock.symbol)),
  ]);

  return filteredData.map((stock: any) => {
    const stockQuote = quotes?.find((quote) => quote.symbol === stock.symbol);
    const stockImage = images?.find(
      (image) => image.symbol === stock.symbol
    )?.image;
    return {
      ...stock,
      ...stockQuote,
      image: stockImage,
    };
  });
}
