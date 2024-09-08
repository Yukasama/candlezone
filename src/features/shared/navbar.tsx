import { CompanyLogo } from '@/components/company-logo';
import { buttonVariants } from '@/components/ui/button';
import { Searchbar } from '@/features/shared/searchbar';
import { SearchbarMobile } from '@/features/shared/searchbar-mobile';
import { getUser } from '@/lib/auth';
import { getPortfoliosAndStocksByUser } from '@/lib/queries/user';
import Link from 'next/link';
import { SidebarMobile } from './sidebar-mobile';
import { ThemeToggle } from './theme-toggle';
import { UserAccountNav } from './user-account-nav';

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

      <div className="flex flex-1 items-center justify-end gap-2">
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
