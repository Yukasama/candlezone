import { cn } from '@/lib/utils'
import { Quote } from '@/types/stock'
import { Stock } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import Link from 'next/link'
import type { HTMLAttributes } from 'react'
import { SymbolItem } from './symbol-item'

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, 'symbol' | 'companyName' | 'image'>
  quote?: Quote
}

export const StockItem = ({ stock, quote, className }: Readonly<Props>) => {
  if (!stock) {
    return null
  }

  const positive = (quote?.changesPercentage ?? 0) >= 0

  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className={cn(
        'flex h-14 items-center justify-between rounded-md bg-background p-2 px-3 hover:bg-background/70',
        className,
      )}
    >
      <SymbolItem
        stock={{
          symbol: stock.symbol,
          companyName: stock.companyName,
          image: stock?.image,
        }}
      />
      <div className="f-col items-end text-sm">
        <p className="font-semibold">${quote?.price?.toFixed(2) ?? 'N/A'}</p>
        <div className="flex items-center gap-0.5 text-[13px] font-semibold">
          {positive ? (
            <ArrowBigUp
              size={16}
              className="text-emerald-500 dark:text-emerald-400"
            />
          ) : (
            <ArrowBigDown size={16} className="text-red-500" />
          )}
          <span
            className={`${
              positive
                ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-red-500'
            }`}
          >
            {quote?.changesPercentage?.toFixed(2)?.replace('-', '') ?? 'N/A'}%
          </span>
        </div>
      </div>
    </Link>
  )
}
