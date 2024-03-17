import StockImage from "@/components/stock/stock-image";
import { db } from "@/lib/db";
import { Quote } from "@/types/stock";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Link from "next/link";

interface Props {
  quote: Quote;
}

export default async function StockPageItem({ quote }: Props) {
  const stock = await db.stock.findFirst({
    select: { image: true },
    where: { symbol: quote.symbol },
  });

  return (
    <Link
      href={`/stocks/${quote.symbol}`}
      prefetch={false}
      className="flex items-center justify-between w-full hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 p-0.5 px-3 rounded-md">
      <div className="flex items-center gap-3">
        <StockImage src={stock?.image} px={35} />
        <div className="f-col">
          <p className="font-semibold text-[15px]">{quote.symbol}</p>
          <p className="text-[13px] text-zinc-500 max-w-[120px] truncate">
            {quote.name}
          </p>
        </div>
      </div>

      <div className="font-semibold flex items-center gap-1 text-sm">
        {quote.changesPercentage > 0 ? (
          <ArrowBigUp
            size={16}
            className="text-emerald-500 dark:text-emerald-400"
          />
        ) : (
          <ArrowBigDown size={16} className="text-red-500" />
        )}
        <span
          className={`${
            quote.changesPercentage > 0
              ? "text-emerald-500 dark:text-emerald-400"
              : "text-red-500"
          }`}>
          {quote.changesPercentage?.toFixed(2).replace("-", "")}%
        </span>
      </div>
    </Link>
  );
}
