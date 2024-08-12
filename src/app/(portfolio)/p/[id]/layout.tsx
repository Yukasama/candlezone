import { PortfolioItem } from '@/components/portfolio/portfolio-item'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PortfolioSidebar } from '@/features/portfolio/portfolio-sidebar'
import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'
import { Lock, MoreVertical, Pencil, Trash2 } from 'lucide-react'
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

  const userPortfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
    },
    where: { userId: user?.id },
  })

  const noAccess = !portfolio?.isPublic && user?.id !== portfolio?.userId
  if (!portfolio || noAccess) {
    return notFound()
  }

  const isOwner = user?.id === portfolio.userId

  return (
    <div className="flex overflow-hidden">
      <PortfolioSidebar portfolioId={portfolio.id} />
      <div className="w-full overflow-auto">
        <div className="f-center justify-between border-b p-2 px-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost">
                <PortfolioItem portfolio={portfolio} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-faded">
              {userPortfolios.map((entry) => (
                <DropdownMenuItem key={entry.id} className="gap-1.5">
                  <PortfolioItem portfolio={entry} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="f-center gap-2">
            <Link
              href={`/p/${portfolio.id}/analytics`}
              className={cn(
                buttonVariants({ variant: 'mythic', size: 'icon-sm' }),
                'hidden lg:flex',
              )}
            >
              Analyze
            </Link>
            {isOwner && (
              <>
                <Button size="icon-sm">Manage</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="secondary" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-faded">
                    <DropdownMenuItem className="gap-1.5">
                      <Pencil size={16} />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-1.5">
                      <Lock size={16} />
                      Make private
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-1.5">
                      <Trash2 size={16} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
