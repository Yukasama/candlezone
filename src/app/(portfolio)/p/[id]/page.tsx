import PortfolioAllocation from '@/features/portfolio/p/portfolio-allocation'
import { PortfolioAssets } from '@/features/portfolio/p/portfolio-assets'
import { PortfolioChart } from '@/features/portfolio/p/portfolio-chart'
import { getUser } from '@/lib/auth'
import { getPositionsByPortfolioId } from '@/utils/queries/portfolio'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function PortfolioPage({
  params: { id },
}: Readonly<Props>) {
  const portfolio = await getPositionsByPortfolioId({
    portfolioId: id,
  })

  if (!portfolio) {
    return notFound()
  }

  const user = await getUser()
  const isOwner = portfolio.userId === user?.id

  return (
    <div className="f-col xl:flex-row">
      <div className="w-full flex-col border-r">
        <PortfolioChart portfolio={portfolio} className="border-b" />
        <div className="flex justify-between p-4">
          <PortfolioAllocation stocks={portfolio.stocks} />
        </div>
      </div>
      <div>
        <PortfolioAssets portfolio={portfolio} isOwner={isOwner} />
      </div>
    </div>
  )
}
