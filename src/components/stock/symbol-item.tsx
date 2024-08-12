import { cn } from '@/lib/utils'
import { Stock } from '@prisma/client'
import type { HTMLAttributes } from 'react'
import { StockImage } from './stock-image'

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock:
    | (Pick<Stock, 'symbol' | 'companyName'> & Partial<Pick<Stock, 'image'>>)
    | undefined
  size?: 'sm' | 'md'
}

export const SymbolItem = ({
  stock,
  size = 'md',
  className,
}: Readonly<Props>) => {
  const isSmall = size === 'sm'

  return (
    <div
      className={cn(
        'f-center',
        isSmall ? 'h-7 gap-1.5' : 'gap-[9px]',
        className,
      )}
    >
      <StockImage src={stock?.image} px={isSmall ? 30 : 35} />
      <div>
        <p
          className={cn(
            'max-w-[65px] truncate font-medium sm:max-w-[200px]',
            !isSmall && 'text-[15px]',
          )}
        >
          {stock?.companyName}
        </p>
        <p
          className={cn(
            'font-semibold text-gray-400',
            isSmall ? 'text-xs' : 'text-sm',
          )}
        >
          {stock?.symbol}
        </p>
      </div>
    </div>
  )
}
