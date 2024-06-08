import { ArrowBigUp, ArrowBigDown, SunMoon } from 'lucide-react'
import { AfterHoursQuote, Quote } from '@/types/stock'
import type { HTMLAttributes } from 'react'

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
    <div className="flex items-center gap-1.5 text-[15px]">
      <SunMoon size={18} />
      <div className="flex items-center gap-1">
        {afterQuote?.price?.toFixed(2)}
        <span className="mt-0.5 text-[12px] text-gray-400">USD</span>
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
