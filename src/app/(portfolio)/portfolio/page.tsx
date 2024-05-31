import { PortfolioCard } from '@/components/portfolio/portfolio-card'
import { getUser } from '@/lib/auth'
import { PLANS } from '@/config/plans'
import { Suspense } from 'react'
import { getPortfoliosByUserId } from '@/utils/queries/portfolio'
import { Card } from '@/components/ui/card'
import { Loader } from '@/components/loader'
import { PortfolioCreateCard } from '@/features/portfolio/portfolio-create-card'

export const metadata = { title: 'My Portfolios' }

export default async function PortfolioOverviewPage() {
  const user = await getUser()
  const portfolios = await getPortfoliosByUserId({ userId: user?.id })

  return (
    <div className="p-6 md:p-10 space-y-4">
      <h2 className="font-semibold text-xl lg:text-2xl">My Portfolios</h2>
      <div className="f-col gap-6 lg:grid lg:grid-cols-2 xl:gap-8 xl:grid-cols-3">
        {/* Portfolio Cards */}
        {portfolios.map((portfolio) => (
          <Suspense
            key={portfolio.id}
            fallback={
              <Card className="h-[340px] f-box border">
                <Loader />
              </Card>
            }
          >
            <PortfolioCard portfolio={portfolio} />
          </Suspense>
        ))}

        {/* Create Card + Modal */}
        {portfolios.length < PLANS[0].maxPortfolios && (
          <PortfolioCreateCard numberOfPortfolios={portfolios.length} />
        )}
      </div>
    </div>
  )
}
