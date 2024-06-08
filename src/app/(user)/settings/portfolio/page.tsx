import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { Suspense } from 'react'
import { PortfolioSetter } from '@/features/portfolio/portfolio-setter'
import { Loader } from '@/components/loader'

export const metadata = { title: 'Portfolio Settings' }

export default async function AccountPortfolioPage() {
  const user = await getUser()
  const portfolios = await db.portfolio.findMany({
    where: { userId: user?.id },
  })

  return (
    <div className="f-col w-full gap-4">
      <div className="f-col gap-1">
        <h2 className="text-2xl font-light">Your Portfolios</h2>
        <Separator />
      </div>

      <Suspense fallback={<Loader />}>
        {portfolios.map((portfolio) => (
          <PortfolioSetter key={portfolio.id} portfolio={portfolio} />
        ))}
      </Suspense>
    </div>
  )
}
