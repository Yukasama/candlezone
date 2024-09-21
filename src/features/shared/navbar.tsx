import { CompanyLogo } from '@/components/company-logo';
import { buttonVariants } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { getPortfoliosAndStocksByUser } from '../user/lib/user';
import { UserAccountNav } from '../user/user-account-nav';
import { Searchbar } from './searchbar/searchbar';
import { SearchbarMobile } from './searchbar/searchbar-mobile';
import { SidebarMobile } from './sidebar/sidebar-mobile';
import { ThemeToggle } from './theme-toggle';

export const Navbar = async () => {
  const user = await getUser();
  const dbUser = await getPortfoliosAndStocksByUser({ userId: user?.id });
  const transformedRecentStocks = dbUser?.recentStocks.map(
    (item) => item.stock,
  );

  return (
    <div className="f-center fixed top-0 z-30 h-16 w-full border-b bg-background p-2 px-6">
      <div className="f-center flex-1 gap-4">
        <SidebarMobile
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={transformedRecentStocks}
        />
        <Link href="/">
          <CompanyLogo />
        </Link>
      </div>

      <Searchbar recentStocks={transformedRecentStocks} />

      <div className="f-center flex-1 justify-end gap-2">
        <SearchbarMobile recentStocks={transformedRecentStocks} />
        <ThemeToggle />

        <div className="pl-0.5">
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link
              href="/sign-in"
              className={buttonVariants({ size: 'sm', variant: 'secondary' })}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
