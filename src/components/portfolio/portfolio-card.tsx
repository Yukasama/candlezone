import Link from 'next/link'
import { StockList } from '@/components/stock/stock-list'
import { Suspense } from 'react'
import { PortfolioWithStocks } from '@/types/portfolio'
import { db } from '@/lib/db'
import { PortfolioImage } from '@/components/portfolio/portfolio-image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader } from '../loader'
import { PortfolioAddModal } from './portfolio-add-modal'
import { PortfolioDeleteModal } from './portfolio-delete-modal'
import { UpdateTitle } from './update-title'
import { UpdateVisibility } from './update-visibility'
import { buttonVariants } from '../ui/button'
import { ExternalLink } from 'lucide-react'

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    'id' | 'title' | 'isPublic' | 'color' | 'stocks'
  >
}

export const PortfolioCard = async ({ portfolio }: Readonly<Props>) => {
  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: {
      id: { in: portfolio.stocks.map((stock) => stock.stockId) },
    },
  })

  return (
    <Card className="h-[340px] f-col bg-faded border">
      <CardHeader className="px-5 flex flex-row items-center justify-between h-20">
        <div className="flex items-center gap-3">
          <Link href={`/p/${portfolio.id}`} aria-label="View portfolio">
            <PortfolioImage portfolio={portfolio} />
          </Link>
          <div>
            <UpdateTitle
              portfolio={portfolio}
              className="bg-zinc-100 hover:bg-white dark:bg-zinc-900 dark:hover:bg-zinc-950"
            />
            <p className="text-sm text-zinc-500 mb-1">
              {portfolio.isPublic ? 'Public' : 'Private'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/p/${portfolio.id}`}
            className={buttonVariants({ size: 'icon', variant: 'secondary' })}
          >
            <ExternalLink size={18} />
          </Link>
          <UpdateVisibility portfolio={portfolio} />
          <PortfolioAddModal portfolio={portfolio} />
          <PortfolioDeleteModal portfolio={portfolio} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="f-box">
        <Suspense fallback={<Loader className="self-center mt-20" />}>
          <div className="f-col w-full">
            <StockList
              symbols={symbols.map((s) => s.symbol)}
              emptyMsg="No Stocks in this Portfolio"
              className="pt-5"
              limit={3}
            />
            {symbols.length > 3 && (
              <Link
                href={`/p/${portfolio.id}`}
                className="text-sm self-start hover:underline text-zinc-400 p-1.5"
              >
                +{symbols.length - 3} more
              </Link>
            )}
          </div>
        </Suspense>
      </CardContent>
    </Card>
  )
}
