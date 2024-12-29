import { CompanyLogo } from '@/components/company-logo';
import { CustomTooltip } from '@/components/custom-tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { getFullUser } from '@/features/user/lib/queries';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { Suspense } from 'react';
import { featuredLinks } from '../config/layout-links';
import { SidebarLink } from './sidebar-link';
import { SidebarPortfolios } from './sidebar-portfolios';

export const Sidebar = async () => {
  const user = await getUser();
  const dbUser = user ? await getFullUser({ userId: user.id }) : undefined;

  return (
    <div className="sm:f-col sticky top-0 z-20 hidden h-screen min-w-16 items-center gap-3 border-r py-4">
      <Link href="/" className="pb-1">
        <CompanyLogo px={28} />
      </Link>

      <div className="f-col items-center gap-1">
        {featuredLinks.map((link) => (
          <Suspense key={link.title}>
            <SidebarLink {...link} />
          </Suspense>
        ))}
      </div>

      <Separator className="w-12" />
      <SidebarPortfolios user={user} portfolios={dbUser?.portfolios} />
      <Separator className="w-12" />

      <div className="f-col items-center gap-1">
        {user &&
          dbUser?.recentStocks.map(({ stock }) => (
            <CustomTooltip
              key={stock.symbol}
              content={
                <Link href={`/stocks/${stock.symbol}`} prefetch={true}>
                  <SymbolItem
                    stock={stock}
                    className="pr-2"
                    size="sm"
                    fullLength
                  />
                </Link>
              }
            >
              <Link
                href={`/stocks/${stock.symbol}`}
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              >
                <StockImage src={stock.image} px={25} />
              </Link>
            </CustomTooltip>
          ))}
      </div>
    </div>
  );
};
