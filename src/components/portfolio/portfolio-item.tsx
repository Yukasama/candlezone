import { HTMLAttributes } from 'react'
import { PortfolioImage } from './portfolio-image'
import { Portfolio } from '@prisma/client'
import { cn } from '@/lib/utils'

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>
}

export const PortfolioItem = ({ portfolio, className }: Readonly<Props>) => {
  return (
    <div className={cn('flex items-center gap-[9px]', className)}>
      <PortfolioImage portfolio={portfolio} />
      <div>
        <p className="text-[15px] font-medium max-w-[65px] sm:max-w-[150px] truncate">
          {portfolio.title}
        </p>
        <p className="text-sm text-gray-400">
          {portfolio.isPublic ? 'Public' : 'Private'}
        </p>
      </div>
    </div>
  )
}
