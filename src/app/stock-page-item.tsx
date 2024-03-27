import { SymbolItem } from "@/components/stock/symbol-item";
import { db } from "@/lib/db";
import { Quote } from "@/types/stock";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Link from "next/link";

interface Props {
  readonly quote: Quote;
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
      className="flex items-center justify-between w-full hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 p-0.5 px-3 rounded-md"
    >
      <SymbolItem
        stock={{
          symbol: quote.symbol,
          companyName: quote.name,
          image: stock?.image!,
        }}
      />
      <div className="f-col items-end">
        <p className="font-semibold text-[15px]">${quote.price?.toFixed(2)}</p>
        <div className="font-semibold flex items-center gap-0.5 text-sm">
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
            }`}
          >
            {quote.changesPercentage?.toFixed(2).replace("-", "")}%
          </span>
        </div>
      </div>
    </Link>
  );
}
