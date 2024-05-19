import { StockItem } from './stock-item'
import { db } from '@/lib/db'
import { getQuotes } from '@/lib/fmp/quote/quote'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  limit?: number
}

interface Props extends LoadingProps {
  symbols: string[]
  title?: string
  description?: string
  emptyMsg?: string
}

export const StockList = async ({
  symbols,
  title,
  description,
  emptyMsg,
  limit = 5,
  className,
}: Readonly<Props>) => {
  if (!symbols?.length) {
    return (
      <div
        className={cn(
          className,
          'text-xl text-center font-medium text-zinc-600'
        )}
      >
        {emptyMsg}
      </div>
    )
  }

  const symbolsToFetch = symbols.slice(0, Math.min(symbols.length, limit))

  let [stocks, quotes] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true, companyName: true, image: true },
      where: { symbol: { in: symbolsToFetch } },
    }),
    getQuotes(symbolsToFetch),
  ])

  const StockItems = () => {
    return (
      <>
        {stocks?.map((stock) => (
          <StockItem
            key={stock.symbol}
            stock={stock}
            quote={quotes?.find((quote) => quote.symbol === stock.symbol)}
          />
        ))}
      </>
    )
  }

  return (
    <div className={cn(className)}>
      {!title && !description ? (
        <div className="space-y-2">
          <StockItems />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <StockItems />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
