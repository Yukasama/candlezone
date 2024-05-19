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
      id: {
        in: portfolio.stocks.map((stock) => stock.stockId),
      },
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
          <UpdateVisibility portfolio={portfolio} />
          <PortfolioAddModal portfolio={portfolio} />
          <PortfolioDeleteModal portfolio={portfolio} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent>
        <Suspense fallback={<Loader />}>
          <StockList
            symbols={symbols.map((s) => s.symbol)}
            emptyMsg="No Stocks in this Portfolio"
            className="pt-5"
            limit={3}
          />
          {symbols.length > 3 && (
            <p className="text-sm text-zinc-400 p-1.5">
              +{symbols.length - 3} more
            </p>
          )}
        </Suspense>
      </CardContent>
    </Card>
  )
}
