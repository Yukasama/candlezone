import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Stock } from "@prisma/client";
import { getAfterHoursQuote, getQuote } from "@/lib/fmp/quote/quote";
import AfterHours from "./after-hours";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, "symbol">;
}

export default async function Price({ stock, className }: Props) {
  const hours = new Date().getHours();
  const isAfterHours = hours >= 22 || hours < 1;

  const [quote, afterQuote] = await Promise.all([
    getQuote(stock.symbol),
    isAfterHours ? getAfterHoursQuote(stock.symbol) : undefined,
  ]);

  if (!quote) {
    return (
      <p className={cn("text-zinc-400", className)}>Price failed to load.</p>
    );
  }

  const positive = quote?.changesPercentage >= 0;

  return (
    <div className={cn("f-col gap-0.5", className)}>
      <div className="flex items-center gap-1">
        <p className="text-2xl md:text-3xl">{quote?.price?.toFixed(2)}</p>
        <span className="text-sm text-zinc-400 mt-2 md:mt-2.5">USD</span>
        <div className="mt-1 flex items-center gap-0.5">
          {positive ? (
            <ArrowBigUp size={22} className="text-price-up" />
          ) : (
            <ArrowBigDown size={22} className="text-price-down" />
          )}
          <p
            className={`text-[18px] md:text-xl ${
              positive ? "text-price-up" : "text-price-down"
            }`}
          >
            {quote.changesPercentage?.toFixed(2).replace("-", "")}%
          </p>
        </div>
      </div>

      <AfterHours quote={quote} afterQuote={afterQuote} />
    </div>
  );
}
