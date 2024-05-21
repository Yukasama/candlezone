import Link from 'next/link'
import { Quote } from '@/types/stock'
import { Stock } from '@prisma/client'
import { cn } from '@/lib/utils'
import { SymbolItem } from './symbol-item'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import type { HTMLAttributes } from 'react'

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
        'flex items-center justify-between h-14 p-2 px-3 bg-background hover:bg-background/70 rounded-md',
        className
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
        <div className="font-semibold flex items-center gap-0.5 text-[13px]">
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
