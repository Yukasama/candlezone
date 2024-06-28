import { db } from '@/lib/db'
import { getQuotes } from '@/lib/fmp/quote/quote'
import { cn } from '@/lib/utils'
import { Quote } from '@/types/stock'
import { Stock } from '@prisma/client'
import type { HTMLAttributes } from 'react'
import { StockItem } from '../../components/stock/stock-item'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  limit?: number
}

interface Props extends LoadingProps {
  symbols: string[]
  title?: string
  description?: string
  emptyMsg?: string
}

const StockItems = ({
  stocks,
  quotes,
}: {
  stocks: Pick<Stock, 'symbol' | 'companyName' | 'image'>[]
  quotes: Quote[] | undefined
}) => {
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
          'text-center text-xl font-medium text-gray-600'
        )}
      >
        {emptyMsg}
      </div>
    )
  }

  const symbolsToFetch = symbols.slice(0, Math.min(symbols.length, limit))

  const [stocks, quotes] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true, companyName: true, image: true },
      where: { symbol: { in: symbolsToFetch } },
    }),
    getQuotes(symbolsToFetch),
  ])

  return (
    <div className={cn(className)}>
      {!title && !description ? (
        <div className="space-y-2">
          <StockItems stocks={stocks} quotes={quotes} />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <StockItems stocks={stocks} quotes={quotes} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
