import { cn } from '@/lib/utils'
import { Portfolio } from '@prisma/client'
import { HTMLAttributes } from 'react'
import { PortfolioImage } from './portfolio-image'

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>
}

export const PortfolioItem = ({ portfolio, className }: Readonly<Props>) => {
  return (
    <div className={cn('f-center gap-[9px]', className)}>
      <PortfolioImage portfolio={portfolio} />
      <div>
        <p className="max-w-[65px] truncate text-[15px] font-medium sm:max-w-[150px]">
          {portfolio.title}
        </p>
        <p className="text-sm text-gray-400">
          {portfolio.isPublic ? 'Public' : 'Private'}
        </p>
      </div>
    </div>
  )
}
