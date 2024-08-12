import { SymbolItem } from '@/components/stock/symbol-item'
import { ActivityQuote } from '@/lib/fmp/quote/quote'
import { cn } from '@/lib/utils'
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
      className="flex w-full items-center justify-between rounded-md bg-background p-1 px-3 hover:bg-background/50"
    >
      <SymbolItem
        stock={{
          symbol: stock.symbol,
          companyName: stock.companyName ?? 'N/A',
          image: stock.image,
        }}
      />
      <div className="f-col items-end">
        <p className="text-sm font-semibold">${stock.price?.toFixed(2)}</p>
        <div className="f-center gap-0.5 text-[13px] font-semibold">
          {(stock.changesPercentage ?? 0) >= 0 ? (
            <ArrowBigUp size={16} className="text-price-up" />
          ) : (
            <ArrowBigDown size={16} className="text-price-down" />
          )}
          <span
            className={cn(
              (stock.changesPercentage ?? 0) >= 0
                ? 'text-price-up'
                : 'text-price-down',
            )}
          >
            {stock.changesPercentage?.toFixed(2).replace('-', '')}%
          </span>
        </div>
      </div>
    </Link>
  )
}
