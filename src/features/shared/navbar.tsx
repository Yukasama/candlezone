import { buttonVariants } from '@/components/ui/button';
import { getUser } from '@/features/auth/actions/get-user';
import Link from 'next/link';
import { Suspense } from 'react';
import { getRecentStocks } from '../stock/actions/get-recent-stocks';
import { Notifications } from '../user/notifications';
import { UserAccountNav } from '../user/user-account-nav';
import { Searchbar } from './searchbar/searchbar';
import { SearchbarMobile } from './searchbar/searchbar-mobile';
import { SidebarMobile } from './sidebar/sidebar-mobile';
import { ThemeToggle } from './theme/theme-toggle';

export const Navbar = async () => {
  const [user, recentStocks] = await Promise.all([
    getUser(),
    getRecentStocks({ withDefaults: true }),
  ]);

  return (
    <div className="bg-background/80 shadow-background sticky top-0 z-20 flex w-full items-center p-2 pr-5 pl-4 shadow-sm sm:pr-6">
      <div className="flex-1">
        <SidebarMobile />
      </div>

      <Suspense>
        <Searchbar recentStocks={recentStocks} />
      </Suspense>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Suspense>
          <SearchbarMobile recentStocks={recentStocks} />
        </Suspense>
        {user && <Notifications />}
        <Suspense>
          <ThemeToggle />
        </Suspense>
        <div className="pl-0.5">
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link
              className={buttonVariants({ size: 'sm', variant: 'faded' })}
              href="/sign-in"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
