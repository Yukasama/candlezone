import type { PropsWithChildren } from 'react'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Separator } from '@/components/ui/separator'
import PortfolioImage from '@/components/portfolio/portfolio-image'
import { Button } from '@nextui-org/button'
import PortfolioNavigation from '../../../../components/portfolio/p/portfolio-navigation'
import { PageLayout } from '@/components/shared/page-layout'
import { Input } from '@/components/ui/input'

const UpdateTitle = dynamic(
  () =>
    import('@/components/portfolio/update-title').then(
      (mod) => mod.UpdateTitle
    ),
  {
    ssr: false,
    loading: () => <Input disabled />,
  }
)

const UpdateVisibility = dynamic(
  () =>
    import('@/components/portfolio/update-visibility').then(
      (mod) => mod.UpdateVisibility
    ),
  {
    ssr: false,
    loading: () => (
      <Button
        size="sm"
        isIconOnly
        isLoading
        className="bg-blue-500 text-white"
      />
    ),
  }
)

const PortfolioAddModal = dynamic(
  () => import('@/components/portfolio/portfolio-add-modal'),
  {
    ssr: false,
    loading: () => <Button size="sm" color="primary" isIconOnly isLoading />,
  }
)

const PortfolioDeleteModal = dynamic(
  () => import('@/components/portfolio/portfolio-delete-modal'),
  {
    ssr: false,
    loading: () => (
      <Button size="sm" className="bg-red-500" isIconOnly isLoading />
    ),
  }
)

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
            <p className="text-zinc-400 text-sm ml-[5px]">
              Created on{' '}
              {portfolio.createdAt.toISOString().split('.')[0].split('T')[0]}
            </p>
          </div>
        </div>

        {/* Actions */}
        {user?.id === portfolio.userId && (
          <div className="flex items-center gap-3">
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
