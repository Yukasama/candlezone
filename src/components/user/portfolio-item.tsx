import { Portfolio } from '@prisma/client'
import { Card } from '@/components/ui/card'
import PortfolioImage from '@/components/portfolio/portfolio-image'
import Link from 'next/link'
import { UpdateVisibility } from '@/components/portfolio/update-visibility'

interface Props {
  portfolio: Portfolio
}

export const PortfolioItem = ({ portfolio }: Readonly<Props>) => {
  return (
    <Card className="flex sm:f-col lg:flex-row items-center justify-between">
      <Link
        href={`/p/${portfolio.id}`}
        prefetch={false}
        className="hover:bg-item-hover w-full p-2 px-4"
      >
        <div className="flex items-center gap-3">
          <PortfolioImage portfolio={portfolio} />
          <div>
            <h2 className="font-medium max-w-[150px] lg:max-w-[200px] truncate">
              {portfolio.title}
            </h2>
            <p className="text-gray-500 text-sm">
              {portfolio.isPublic ? 'Public' : 'Private'}
            </p>
          </div>
        </div>
      </Link>

      <div className="h-full border-l sm:self-end sm:border-l-0 w-40 lg:border-l p-2 px-4 f-box">
        <UpdateVisibility portfolio={portfolio} />
      </div>
    </Card>
  )
}
