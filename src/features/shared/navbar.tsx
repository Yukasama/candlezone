import { buttonVariants } from '@/components/ui/button';
import { getUser } from '@/features/auth/actions/get-user';
import Link from 'next/link';
import { getPortfoliosAndStocksByUser } from '../user/lib/queries';
import { Notifications } from '../user/notifications';
import { UserAccountNav } from '../user/user-account-nav';
import { Searchbar } from './searchbar/searchbar';
import { SearchbarMobile } from './searchbar/searchbar-mobile';
import { SidebarMobile } from './sidebar/sidebar-mobile';
import { ThemeToggle } from './theme/theme-toggle';

export const Navbar = async () => {
  const user = await getUser();
  const dbUser = await getPortfoliosAndStocksByUser({ userId: user?.id });
  const recentStocks = dbUser?.recentStocks.map(({ stock }) => stock);

  return (
    <div className="f-center sticky top-0 z-20 w-full bg-background/80 p-2 pl-4 pr-5 shadow-md shadow-background sm:pr-6">
      <div className="flex-1">
        <SidebarMobile
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={recentStocks}
        />
      </div>

      <Searchbar recentStocks={recentStocks} />

      <div className="f-center flex-1 justify-end gap-2">
        <SearchbarMobile recentStocks={recentStocks} />
        {user && <Notifications />}
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
