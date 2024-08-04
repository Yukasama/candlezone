import { PortfolioImage } from '@/components/portfolio/portfolio-image'
import { UpdateTitle } from '@/components/portfolio/update-title'
import { Button, buttonVariants } from '@/components/ui/button'
import { PortfolioNavigation } from '@/features/portfolio/p/portfolio-navigation'
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
  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findFirst({
      select: {
        title: true,
        isPublic: true,
        userId: true,
      },
      where: { id },
    }),
  ])

  const noAccess = !portfolio?.isPublic && user?.id !== portfolio?.userId
  if (!portfolio || noAccess) {
    return { title: 'Portfolio not found.' }
  }

  return { title: portfolio.title }
}

export default async function PortfolioLayout({
  children,
  params: { id },
}: Readonly<Props>) {
  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findFirst({
      where: { id },
    }),
  ])

  const noAccess = !portfolio?.isPublic && user?.id !== portfolio?.userId
  if (!portfolio || noAccess) {
    return notFound()
  }

  const isOwner = user?.id === portfolio.userId

  return (
    <div className="flex overflow-hidden">
      <PortfolioNavigation portfolioId={portfolio.id} />
      <div className="w-full overflow-auto">
        <div className="f-center justify-between border-b p-2 px-4">
          <div className="f-center gap-2">
            <PortfolioImage portfolio={portfolio} px={40} />
            {isOwner ? (
              <>
                <UpdateTitle portfolio={portfolio} className="translate-x-0" />
                <Link
                  href={`/p/${portfolio.id}/settings`}
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  Edit
                </Link>
              </>
            ) : (
              <p className="md:text-lg lg:text-xl">{portfolio.title}</p>
            )}
          </div>
          <div className="f-center gap-2">
            <Link
              href={`/p/${portfolio.id}/analytics`}
              className={cn(
                buttonVariants({ variant: 'mythic' }),
                'hidden lg:flex',
              )}
            >
              Analyze
            </Link>
            {isOwner && <Button>Manage</Button>}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
