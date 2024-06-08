import Link from 'next/link'
import { Searchbar } from '../../components/searchbar'
import { db } from '@/lib/db'
import { CompanyLogo } from '../../components/company-logo'
import { UserAccountNav } from '../user/user-account-nav'
import { NavbarMenu } from './navbar-menu'
import { getUser } from '@/lib/auth'
import { buttonVariants } from '../../components/ui/button'
import { Sidebar } from './sidebar'
import { ThemeToggle } from '../../components/theme-toggle'

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
    <div className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-b bg-background/70 p-2 px-6 backdrop:blur">
      <div className="flex flex-1 items-center gap-5">
        <Sidebar
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={transformedRecentStocks}
        />
        <Link href="/">
          <CompanyLogo />
        </Link>
        <div className="hidden md:flex">
          <Searchbar recentStocks={transformedRecentStocks} />
        </div>
      </div>

      <NavbarMenu />

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="flex md:hidden">
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
