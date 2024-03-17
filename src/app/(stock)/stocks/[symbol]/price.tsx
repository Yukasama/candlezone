import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Stock } from "@prisma/client";
import { getAfterHoursQuote, getQuote } from "@/actions/fmp/quote";
import AfterHours from "./after-hours";
import { cn } from "@/lib/utils";
import { SkeletonText } from "@/components/ui/skeleton";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, "symbol">;
}

export function PriceLoading({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("f-col gap-0.5", className)}>
      <SkeletonText />
      <SkeletonText />
    </div>
  );
}

export default async function Price({ stock, className }: Props) {
  const [quote, afterQuote] = await Promise.all([
    getQuote(stock.symbol),
    getAfterHoursQuote(stock.symbol),
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
        <span className="text-sm text-zinc-400 mt-[7px] md:mt-[9px]">USD</span>
        <div className="mt-0.5 flex items-center gap-0.5">
          {positive ? (
            <ArrowBigUp size={22} className="text-price-up" />
          ) : (
            <ArrowBigDown size={22} className="text-price-down" />
          )}
          <p
            className={`text-[18px] md:text-xl ${
              positive ? "text-price-up" : "text-price-down"
            }`}>
            {quote.changesPercentage?.toFixed(2).replace("-", "")}%
          </p>
        </div>
      </div>

      <AfterHours quote={quote} afterQuote={afterQuote} />
    </div>
  );
}
