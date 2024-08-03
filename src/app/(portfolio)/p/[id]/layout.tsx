import { PortfolioImage } from '@/components/portfolio/portfolio-image'
import { UpdateTitle } from '@/components/portfolio/update-title'
import { Button, buttonVariants } from '@/components/ui/button'
import { PortfolioEditModal } from '@/features/portfolio/p/portfolio-edit-modal'
import PortfolioNavigation from '@/features/portfolio/p/portfolio-navigation'
import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { PropsWithChildren } from 'react'

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
    include: {
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
  if (!portfolio.isPublic && user?.id !== portfolio.userId) {
    return notFound()
  }

  return (
    <div className="flex">
      <PortfolioNavigation portfolioId={portfolio.id} />
      <div className="w-full">
        <div className="flex items-center justify-between border-b p-2 px-4">
          <div className="flex items-center gap-2">
            <PortfolioImage portfolio={portfolio} px={40} />
            {user?.id === portfolio.userId ? (
              <UpdateTitle portfolio={portfolio} className="translate-x-0" />
            ) : (
              portfolio.title
            )}
            <PortfolioEditModal portfolio={portfolio} />
          </div>

          {user?.id === portfolio.userId && (
            <div className="flex items-center gap-2">
              <Link
                href={`/p/${portfolio.id}/analytics`}
                className={cn(
                  buttonVariants({ variant: 'mythic' }),
                  'hidden lg:flex',
                )}
              >
                Analyze
              </Link>
              <Button variant="default">Manage</Button>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
