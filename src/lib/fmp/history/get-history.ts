import "server-only";
import { History } from "@/types/stock";
import { FMP_API_URL, TIMEFRAMES } from "@/config/fmp/config";

interface Props {
  symbol: string;
  timeframe: string;
  from?: Date;
  allFields?: boolean;
}

export const getHistory = async ({
  symbol,
  timeframe,
  from,
  allFields,
}: Props) => {
  const { url, limit } = TIMEFRAMES[timeframe];

  const result = await fetch(constructHistoryUrl(symbol, url, from)).then(
    (res) => res.json()
  );

  const data = url.includes("price-full") ? result.historical : result;
  const history = data
    .slice(0, data.length < limit ? data.length : limit)
    .reverse();

  if (allFields) {
    return history;
  }

  return history.map((item: History) => ({
    date: item.date,
    close: item.close,
  }));
};

export const constructHistoryUrl = (
  symbol: string,
  url: string,
  from?: Date
) => {
  return `${FMP_API_URL}v3/${url}/${symbol}?${
    url.includes("price-full")
      ? "from=1975-01-01"
      : from && `from=${from.toDateString().split("T")[0]}`
  }&apikey=${process.env.FMP_API_KEY}`;
};
