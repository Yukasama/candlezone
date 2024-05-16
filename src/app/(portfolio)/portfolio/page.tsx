import PortfolioCard from '@/components/portfolio/portfolio-card'
import { getUser } from '@/lib/auth'
import { PLANS } from '@/config/plans'
import { Suspense } from 'react'
import { Spinner } from '@nextui-org/spinner'
import dynamic from 'next/dynamic'
import { getPortfoliosByUserId } from '@/utils/queries/portfolio'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'My Portfolios' }

const PortfolioCreateCard = dynamic(
  () => import('../../../components/portfolio/portfolio-create-card'),
  {
    ssr: false,
    loading: () => (
      <Card className="h-[340px] f-box">
        <Spinner />
      </Card>
    ),
  }
)

export default async function PortfoliosPage() {
  const user = await getUser()
  const portfolios = await getPortfoliosByUserId(user?.id)

  return (
    <div className="f-col p-6 md:p-10 gap-6 md:grid md:grid-cols-2 xl:gap-8 xl:grid-cols-3">
      {/* Portfolio Cards */}
      {portfolios.map((portfolio) => (
        <Suspense key={portfolio.id} fallback={<Spinner />}>
          <PortfolioCard portfolio={portfolio} />
        </Suspense>
      ))}

      {/* Create Card + Modal */}
      {portfolios.length < PLANS[0].maxPortfolios && (
        <PortfolioCreateCard numberOfPortfolios={portfolios.length} />
      )}
    </div>
  )
}
