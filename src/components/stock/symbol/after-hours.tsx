import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { AfterHoursQuote, Quote } from '@/types/stock'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  quote: Pick<Quote, 'price' | 'changesPercentage'>
  afterQuote: Pick<AfterHoursQuote, 'price'> | undefined
}

export const AfterHours = ({ quote, afterQuote }: Readonly<Props>) => {
  if (!afterQuote?.price || !quote.price) {
    return null
  }

  const changesPercentage = (afterQuote.price / quote.price - 1) * 100
  const positive = changesPercentage >= 0

  return (
    <div className="flex items-center gap-2 text-[15px]">
      <p className="text-zinc-400">After Hours:</p>
      <div className="flex items-center gap-1">
        <p>{afterQuote?.price?.toFixed(2)}</p>
        <span className="text-[12px] text-zinc-400 mt-0.5">USD</span>
        {positive ? (
          <ArrowBigUp size={18} className="text-price-up" />
        ) : (
          <ArrowBigDown size={18} className="text-price-down" />
        )}
        <p className={`${positive ? 'text-price-up' : 'text-price-down'}`}>
          {changesPercentage.toFixed(2).replace('-', '')}%
        </p>
      </div>
    </div>
  )
}
