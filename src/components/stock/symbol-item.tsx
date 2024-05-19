import { Stock } from '@prisma/client'
import { StockImage } from './stock-image'
import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

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
        `flex items-center ${isSmall ? 'gap-1.5 h-7' : 'gap-[9px]'}`,
        className
      )}
    >
      <StockImage src={stock?.image} px={isSmall ? 30 : 35} />
      <div>
        <p
          className={`${
            !isSmall && 'text-[15px]'
          } font-medium max-w-[65px] sm:max-w-[200px] truncate`}
        >
          {stock?.companyName}
        </p>
        <p
          className={`font-semibold ${
            isSmall ? 'text-xs' : 'text-sm'
          } text-zinc-500`}
        >
          {stock?.symbol}
        </p>
      </div>
    </div>
  )
}
