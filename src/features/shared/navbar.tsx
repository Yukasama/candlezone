import { CompanyLogo } from '@/components/company-logo';
import { Searchbar } from '@/components/searchbar';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { UserAccountNav } from '../user/user-account-nav';
import { NavbarMenu } from './navbar-menu';
import { Sidebar } from './sidebar';

export const Navbar = async () => {
  const user = await getUser();

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
  });

  const transformedRecentStocks = dbUser?.recentStocks.map(
    (item) => item.stock,
  );

  return (
    <div className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-b bg-background p-2 px-6">
      <div className="flex flex-1 items-center gap-4">
        <Sidebar
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={transformedRecentStocks}
        />
        <Link href="/">
          <CompanyLogo />
        </Link>
        <div className="hidden md:flex">
          <Searchbar user={user} recentStocks={transformedRecentStocks} />
        </div>
      </div>

      <NavbarMenu />

      <div className="flex flex-1 items-center justify-end gap-1.5">
        <div className="flex md:hidden">
          <Searchbar
            user={user}
            recentStocks={transformedRecentStocks}
            hotkey
          />
        </div>

        <ThemeToggle />

        <div className="pl-0.5">
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
    </div>
  );
};
