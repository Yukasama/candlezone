import Link from 'next/link'
import { Searchbar } from '../searchbar'
import { db } from '@/lib/db'
import { CompanyLogo } from '../company-logo'
import { UserAccountNav } from '../../user/user-account-nav'
import { NavbarMenu } from './navbar-menu'
import { getUser } from '@/lib/auth'
import { buttonVariants } from '../../ui/button'
import { Sidebar } from '../sidebar'
import { ThemeToggle } from '../theme-toggle'

export const Navbar = async () => {
  const user = await getUser()

  const dbUser = await db.user.findFirst({
    select: {
      portfolios: {
        select: {
          id: true,
          title: true,
          color: true,
          isPublic: true,
        },
        orderBy: { title: 'asc' },
      },
      recentStocks: {
        select: {
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        distinct: 'stockId',
        take: 5,
      },
    },
    where: { id: user?.id },
  })

  const transformedRecentStocks = dbUser?.recentStocks.map((item) => item.stock)

  return (
    <div className="sticky top-0 h-16 z-20 flex w-full items-center justify-between gap-4 p-2 px-6 border-b bg-background/70 backdrop:blur">
      <div className="flex items-center gap-5 flex-1">
        <Sidebar
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={transformedRecentStocks}
        />
        <Link href="/">
          <CompanyLogo />
        </Link>
        <div className="md:flex hidden">
          <Searchbar recentStocks={transformedRecentStocks} />
        </div>
      </div>

      <NavbarMenu />

      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="md:hidden flex">
          <Searchbar recentStocks={transformedRecentStocks} hotkey />
        </div>

        <ThemeToggle />

        {user ? (
          <UserAccountNav user={user} isAdmin={user?.role === 'ADMIN'} />
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({ size: 'sm', variant: 'secondary' })}
            aria-label="Sign In"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}
