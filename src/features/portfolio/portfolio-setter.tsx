import { PortfolioItem } from '@/components/portfolio/portfolio-item'
import { UpdateVisibility } from '@/components/portfolio/update-visibility'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Portfolio } from '@prisma/client'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { PortfolioDeleteModal } from './portfolio-delete-modal'

interface Props {
  portfolio: Portfolio
}

export const PortfolioSetter = ({ portfolio }: Readonly<Props>) => {
  return (
    <Card className="bg-faded flex items-center justify-between border">
      <Link
        href={`/p/${portfolio.id}`}
        prefetch={false}
        className="w-full p-2 px-4"
      >
        <PortfolioItem portfolio={portfolio} />
      </Link>

      <div className="flex items-center gap-2 border-l p-2 px-4">
        <Link
          href={`/p/${portfolio.id}`}
          className={buttonVariants({ variant: 'mythic', size: 'icon' })}
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
