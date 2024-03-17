"use server";

import { getQuotes } from "./quote";
import { MarketCapQuote, MarketCapStock } from "@/types/stock";
import { FMP_API_URL, FMP } from "@/config/fmp/config";
import { PROFILE_SIMULATION } from "@/config/fmp/simulation";
import { env } from "@/env.mjs";
import { Profile } from "@/types/stock";

export async function getMarketCap(): Promise<MarketCapQuote[] | undefined> {
  const orderedByMktCap: MarketCapStock[] = await fetch(
    `https://financialmodelingprep.com/api/v3/stock-screener?apikey=${env.FMP_API_KEY}`,
    { cache: "force-cache" }
  ).then((res) => res.json());

  const filteredData = orderedByMktCap
    .filter(
      (stock) =>
        !stock.isEtf &&
        !stock.isFund &&
        stock.symbol !== "GOOGL" &&
        stock.symbol !== "BRK-A" &&
        stock.isActivelyTrading &&
        stock.exchangeShortName !== "EURONEXT"
    )
    .slice(0, 1700);

  const [quotes, profiles] = await Promise.all([
    getQuotes(filteredData.map((stock: any) => stock.symbol)),
    getProfiles(
      filteredData.map((stock: any) => stock.symbol),
      true
    ),
  ]);

  return filteredData.map((stock: any) => {
    const stockQuote = quotes?.find((quote) => quote.symbol === stock.symbol);
    const stockProfile = profiles?.find(
      (profile) => profile.symbol === stock.symbol
    );

    return {
      symbol: stock.symbol,
      marketCap: stock.marketCap,
      price: stock.price,
      sector: stock.sector,
      industry: stock.industry,
      companyName: stock.companyName,
      exchange: stock.exchangeShortName,
      country: stock.country,
      changesPercentage: stockQuote?.changesPercentage,
      image: stockProfile?.image,
    };
  });
}

export async function getProfiles(
  symbols: string[] | undefined,
  allFields?: boolean
): Promise<Profile[] | undefined> {
  try {
    if (FMP.simulation) {
      return [
        PROFILE_SIMULATION,
        PROFILE_SIMULATION,
        PROFILE_SIMULATION,
        PROFILE_SIMULATION,
        PROFILE_SIMULATION,
      ];
    }

    if (!symbols) {
      return undefined;
    }

    const url = `${FMP_API_URL}v3/profile/${symbols.join(",")}?apikey=${
      env.FMP_API_KEY
    }`;

    const result = (await fetch(url, {
      cache: "force-cache",
    }).then((res) => res.json())) as Profile[] | undefined;

    if (allFields) {
      return result;
    }

    return result?.map((res) => {
      return {
        symbol: res.symbol,
        image: res.image,
      };
    });
  } catch (err) {
    return undefined;
  }
}
