import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { Stock } from '@prisma/client'
import { getAfterHoursQuote, getQuote } from '@/lib/fmp/quote/quote'
import { AfterHours } from './after-hours'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, 'symbol'>
}

const LastUpdated = () => {
  const localTime = new Date()
  localTime.setHours(localTime.getHours() + 2)

  return (
    <p className="text-gray-400 text-sm">
      Last updated: {localTime.toISOString().split('T')[1].slice(0, 8)}
    </p>
  )
}

export const Price = async ({ stock, className }: Readonly<Props>) => {
  const localTime = new Date()
  localTime.setHours(localTime.getHours() + 2)

  const hours = localTime.getHours()
  const minutes = localTime.getMinutes()
  const time = hours + minutes / 60

  const isPreMarket = time >= 10 && time < 15.5 && !stock.symbol.includes('.DE')
  const isAfterHours =
    (hours >= 22 || hours < 1) && !stock.symbol.includes('.DE')
  const showAfterHours = isPreMarket || isAfterHours

  const [quote, afterQuote] = await Promise.all([
    getQuote(stock.symbol),
    showAfterHours ? getAfterHoursQuote(stock.symbol) : undefined,
  ])

  if (!quote) {
    return (
      <div className={cn('text-gray-400 f-col text-sm gap-0.5', className)}>
        <p>Price failed to load.</p>
        <LastUpdated />
      </div>
    )
  }

  const positive = quote.changesPercentage >= 0
  const isEUR = stock.symbol.includes('.DE')

  return (
    <div className={cn('f-col gap-0.5', className)}>
      <div className="flex items-center gap-1">
        <p className="text-2xl md:text-3xl">{quote.price?.toFixed(2)}</p>
        <span className="text-sm text-gray-400 mt-2 md:mt-2.5">
          {isEUR ? 'EUR' : 'USD'}
        </span>
        <div className="mt-[5px] flex items-center gap-0.5">
          {positive ? (
            <ArrowBigUp size={22} className="text-price-up" />
          ) : (
            <ArrowBigDown size={22} className="text-price-down" />
          )}
          <p
            className={`text-[18px] md:text-xl ${
              positive ? 'text-price-up' : 'text-price-down'
            }`}
          >
            {quote.changesPercentage?.toFixed(2).replace('-', '')}%
          </p>
        </div>
      </div>

      <AfterHours quote={quote} afterQuote={afterQuote} />
      <LastUpdated />
    </div>
  )
}
