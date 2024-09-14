import { PortfolioImage } from '@/components/portfolio/portfolio-image';
import { PortfolioItem } from '@/components/portfolio/portfolio-item';
import { StockImage } from '@/components/stock/stock-image';
import { SymbolItem } from '@/components/stock/symbol-item';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { featuredLinks } from '@/config/layout-links';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { CreateModal } from '../portfolio/create-modal';
import { SidebarLink } from './sidebar-link';

export const Sidebar = async () => {
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

  return (
    <div className="sm:f-col fixed top-16 z-10 mb-16 hidden h-[calc(100%-64px)] min-w-16 items-center gap-3 overflow-y-hidden border-r py-2.5">
      <div className="f-col items-center gap-1">
        {featuredLinks.map((link) => (
          <SidebarLink key={link.title} {...link} />
        ))}
      </div>

      <Separator />

      <div className="f-col items-center gap-1">
        {user ? (
          (dbUser?.portfolios.length ?? 0) >= 0 ? (
            dbUser?.portfolios?.map((portfolio) => (
              <CustomTooltip
                key={portfolio.id}
                content={
                  <Link href={`/p/${portfolio.id}`}>
                    <PortfolioItem portfolio={portfolio} size="sm" />
                  </Link>
                }
              >
                <Link href={`/p/${portfolio.id}`}>
                  <Card className="p-1.5 hover:bg-accent">
                    <PortfolioImage portfolio={portfolio} px={25} />
                  </Card>
                </Link>
              </CustomTooltip>
            ))
          ) : (
            <CustomTooltip content="Create portfolio">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="small-icon" aria-label="Create portfolio">
                    <Plus className="size-4" />
                  </Button>
                </DialogTrigger>
                <CreateModal />
              </Dialog>
            </CustomTooltip>
          )
        ) : (
          <CustomTooltip content="Sign in to create a portfolio">
            <Link
              href="/sign-in"
              aria-label="Sign in to create a portfolio"
              className={buttonVariants({ size: 'small-icon' })}
            >
              <Plus className="size-4" />
            </Link>
          </CustomTooltip>
        )}
      </div>

      <Separator />

      <div className="f-col items-center gap-1">
        {user &&
          dbUser?.recentStocks?.map(({ stock }) => (
            <CustomTooltip
              key={stock.symbol}
              content={
                <Link href={`/stocks/${stock.symbol}`}>
                  <SymbolItem stock={stock} size="sm" />
                </Link>
              }
            >
              <Link href={`/stocks/${stock.symbol}`}>
                <Card className="p-1.5 hover:bg-accent">
                  <StockImage src={stock.image} px={25} />
                </Card>
              </Link>
            </CustomTooltip>
          ))}
      </div>
    </div>
  );
};
