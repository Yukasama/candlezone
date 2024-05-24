import type { PropsWithChildren } from 'react'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { PortfolioImage } from '@/components/portfolio/portfolio-image'
import PortfolioNavigation from '../../../../components/portfolio/p/portfolio-navigation'
import { PageLayout } from '@/components/shared/page-layout'
import { PortfolioAddModal } from '@/components/portfolio/portfolio-add-modal'
import { PortfolioDeleteModal } from '@/components/portfolio/portfolio-delete-modal'
import { UpdateTitle } from '@/components/portfolio/update-title'
import { UpdateVisibility } from '@/components/portfolio/update-visibility'

interface Props extends PropsWithChildren {
  params: { id: string }
}

export async function generateStaticParams() {
  const data = await db.portfolio.findMany({
    select: { id: true },
  })

  return data.map((portfolio) => ({ id: portfolio.id }))
}

export async function generateMetadata({ params: { id } }: Readonly<Props>) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      title: true,
      isPublic: true,
      userId: true,
    },
    where: { id },
  })

  if (!portfolio) {
    return { title: 'Portfolio not found' }
  }

  const user = await getUser()

  // Portfolio is private and it does not belong to the user
  if (!portfolio.isPublic && user?.id !== portfolio.userId) {
    return { title: 'Portfolio not found' }
  }

  return { title: portfolio.title }
}

export default async function PortfolioLayout({
  children,
  params: { id },
}: Readonly<Props>) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
      userId: true,
      createdAt: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { id },
  })

  if (!portfolio) {
    return notFound()
  }

  const user = await getUser()

  // Portfolio is private and it does not belong to the user
  if (!portfolio.isPublic && user?.id !== portfolio.userId) {
    return notFound()
  }

  return (
    <PageLayout className="gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PortfolioImage portfolio={portfolio} px={50} />
          <div className="f-col gap-0.5">
            <h3 className="text-xl">
              {user?.id === portfolio.userId ? (
                <UpdateTitle
                  portfolio={portfolio}
                  className="translate-x-0.5"
                />
              ) : (
                portfolio.title
              )}
            </h3>
            <p className="text-slate-400 text-sm ml-[5px]">
              Created on{' '}
              {portfolio.createdAt.toISOString().split('.')[0].split('T')[0]}
            </p>
          </div>
        </div>

        {/* Actions */}
        {user?.id === portfolio.userId && (
          <div className="flex items-center gap-2">
            <UpdateVisibility portfolio={portfolio} />
            <PortfolioAddModal portfolio={portfolio} />
            <PortfolioDeleteModal portfolio={portfolio} />
          </div>
        )}
      </div>

      <PortfolioNavigation portfolioId={portfolio.id} />
      <Separator />

      {/* Dashboard */}
      {portfolio.stocks.length ? (
        children
      ) : (
        <div className="f-box f-col gap-3 mt-52">
          <h2 className="font-medium text-lg">
            There are no stocks in this portfolio.
          </h2>
          {user?.id === portfolio.userId && (
            <PortfolioAddModal portfolio={portfolio} />
          )}
        </div>
      )}
    </PageLayout>
  )
}
