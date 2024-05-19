import Link from 'next/link'
import { Quote } from '@/types/stock'
import { Stock } from '@prisma/client'
import { Card } from '../ui/card'
import { cn } from '@/utils/cn'
import { SymbolItem } from './symbol-item'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, 'symbol' | 'image'> | undefined
  quote: Quote | null | undefined
}

export default function StockItem({
  stock,
  quote,
  className,
}: Readonly<Props>) {
  if (!quote) {
    return null
  }

  const positive = quote.changesPercentage >= 0

  return (
    <Link href={`/stocks/${quote.symbol}`} prefetch={false}>
      <Card
        className={cn(
          'flex items-center justify-between h-12 p-2 bg-item hover:bg-item-hover mb-2',
          className
        )}
      >
        <SymbolItem
          stock={{
            symbol: quote.symbol,
            companyName: quote.name,
            image: stock?.image,
          }}
        />
        <div className="f-col items-end text-sm">
          <p className="font-semibold">${quote.price?.toFixed(2)}</p>
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
              {quote.changesPercentage?.toFixed(2).replace('-', '')}%
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
