import { Allocation } from '@/features/portfolio/chart/allocation'
import { PortfolioChart } from '@/features/portfolio/chart/portfolio-chart'
import { PositionManager } from '@/features/portfolio/position-manager'
import { getUser } from '@/lib/auth'
import { getPortfolioWithQuotes } from '@/utils/queries/portfolio'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function PortfolioPage({
  params: { id },
}: Readonly<Props>) {
  const [user, portfolio] = await Promise.all([
    getUser(),
    getPortfolioWithQuotes({ portfolioId: id }),
  ])

  if (!portfolio) {
    return notFound()
  }

  const isOwner = portfolio.userId === user?.id

  return (
    <div className="f-col xl:flex-row">
      <div className="flex-1 flex-col border-r">
        <PortfolioChart portfolio={portfolio} className="border-b" />
        <div className="flex justify-between p-4">
          <Allocation sectors={portfolio.stocks.map((stock) => stock.sector)} />
          <Allocation sectors={portfolio.stocks.map((stock) => stock.sector)} />
          <Allocation sectors={portfolio.stocks.map((stock) => stock.sector)} />
        </div>
      </div>
      <div className="hidden overflow-hidden lg:flex">
        <PositionManager portfolio={portfolio} isOwner={isOwner} />
      </div>
    </div>
  )
}
