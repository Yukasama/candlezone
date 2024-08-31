import { CompanyLogo } from '@/components/company-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { Searchbar } from '@/features/shared/searchbar';
import { SearchbarMobile } from '@/features/shared/searchbar-mobile';
import { getUser } from '@/lib/auth';
import { getPortfoliosAndStocksByUser } from '@/utils/queries/user';
import Link from 'next/link';
import { UserAccountNav } from '../user/user-account-nav';
import { SidebarMobile } from './sidebar-mobile';

export const Navbar = async () => {
  const user = await getUser();
  const dbUser = await getPortfoliosAndStocksByUser({ userId: user?.id });
  const transformedRecentStocks = dbUser?.recentStocks.map(
    (item) => item.stock,
  );

  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 border-b bg-background p-2 px-6">
      <div className="flex flex-1 items-center gap-4">
        <SidebarMobile
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={transformedRecentStocks}
        />
        <Link href="/">
          <CompanyLogo />
        </Link>
      </div>

      <Searchbar user={user} recentStocks={transformedRecentStocks} />

      <div className="flex flex-1 items-center justify-end gap-1.5">
        <SearchbarMobile user={user} recentStocks={transformedRecentStocks} />
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
