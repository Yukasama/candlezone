import { Portfolio } from '@prisma/client'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { UpdateVisibility } from '@/components/portfolio/update-visibility'
import { PortfolioItem } from './portfolio-item'
import { PortfolioDeleteModal } from './portfolio-delete-modal'
import { buttonVariants } from '../ui/button'
import { ExternalLink } from 'lucide-react'

interface Props {
  portfolio: Portfolio
}

export const PortfolioSetter = ({ portfolio }: Readonly<Props>) => {
  return (
    <Card className="flex items-center justify-between border bg-faded">
      <Link
        href={`/p/${portfolio.id}`}
        prefetch={false}
        className="w-full p-2 px-4"
      >
        <PortfolioItem portfolio={portfolio} />
      </Link>

      <div className="flex gap-2 items-center border-l p-2 px-4">
        <Link
          href={`/p/${portfolio.id}`}
          className={buttonVariants({ variant: 'secondary', size: 'icon' })}
          prefetch={false}
        >
          <ExternalLink size={18} />
        </Link>
        <UpdateVisibility portfolio={portfolio} />
        <PortfolioDeleteModal portfolio={portfolio} />
      </div>
    </Card>
  )
}
