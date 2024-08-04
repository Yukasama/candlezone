import { PortfolioAllocation } from '@/features/portfolio/p/portfolio-allocation'
import { PortfolioAssets } from '@/features/portfolio/p/portfolio-assets'
import { PortfolioChart } from '@/features/portfolio/p/portfolio-chart'
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
          <PortfolioAllocation
            sectors={portfolio.stocks.map((stock) => stock.sector)}
          />
        </div>
      </div>
      <div className="overflow-hidden">
        <PortfolioAssets portfolio={portfolio} isOwner={isOwner} />
      </div>
    </div>
  )
}
