import { SymbolItem } from '@/components/stock/symbol-item'
import { ActivityQuote } from '@/lib/fmp/quote/quote'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import Link from 'next/link'

interface Props {
  stock: ActivityQuote
}

export const StockPageItem = async ({ stock }: Readonly<Props>) => {
  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      prefetch={false}
      className="flex items-center justify-between w-full bg-background hover:bg-background/50 p-1 px-3 rounded-md"
    >
      <SymbolItem
        stock={{
          symbol: stock.symbol,
          companyName: stock.companyName ?? 'N/A',
          image: stock.image,
        }}
      />
      <div className="f-col items-end">
        <p className="font-semibold text-sm">${stock.price?.toFixed(2)}</p>
        <div className="font-semibold flex items-center gap-0.5 text-[13px]">
          {(stock.changesPercentage ?? 0) >= 0 ? (
            <ArrowBigUp
              size={16}
              className="text-emerald-500 dark:text-emerald-400"
            />
          ) : (
            <ArrowBigDown size={16} className="text-red-500" />
          )}
          <span
            className={`${
              (stock.changesPercentage ?? 0) >= 0
                ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-red-500'
            }`}
          >
            {stock.changesPercentage?.toFixed(2).replace('-', '')}%
          </span>
        </div>
      </div>
    </Link>
  )
}
