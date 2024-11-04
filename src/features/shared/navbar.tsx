import { buttonVariants } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { Suspense } from 'react';
import { getPortfoliosAndStocksByUser } from '../user/lib/queries';
import { UserAccountNav } from '../user/user-account-nav';
import { Searchbar } from './searchbar/searchbar';
import { SearchbarMobile } from './searchbar/searchbar-mobile';
import { SidebarMobile } from './sidebar/sidebar-mobile';
import { ThemeToggle } from './theme/theme-toggle';

export const experimental_ppr = true;

export const Navbar = async () => {
  const user = await getUser();
  const dbUser = await getPortfoliosAndStocksByUser({ userId: user?.id });
  const recentStocks = dbUser?.recentStocks.map(({ stock }) => stock);

  return (
    <div className="f-center sticky top-0 z-20 w-full p-2 pl-4 pr-5 sm:pr-6">
      <div className="flex-1">
        <SidebarMobile
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={recentStocks}
        />
      </div>

      <Suspense>
        <Searchbar recentStocks={recentStocks} />
      </Suspense>

      <div className="f-center flex-1 justify-end gap-2">
        <Suspense>
          <SearchbarMobile recentStocks={recentStocks} />
        </Suspense>

        <ThemeToggle />

        <div className="pl-0.5">
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link
              href="/sign-in"
              className={buttonVariants({ size: 'sm', variant: 'faded' })}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
