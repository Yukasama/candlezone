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
    <div className="space-y-4 p-6 md:p-10">
      <h2 className="text-xl font-semibold lg:text-2xl">My Portfolios</h2>
      <div className="f-col gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {/* Portfolio Cards */}
        {portfolios.map((portfolio) => (
          <Suspense
            key={portfolio.id}
            fallback={
              <Card className="f-box h-[340px] border">
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
