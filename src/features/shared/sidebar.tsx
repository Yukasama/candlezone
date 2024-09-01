import { PortfolioImage } from '@/components/portfolio/portfolio-image';
import { PortfolioItem } from '@/components/portfolio/portfolio-item';
import { StockImage } from '@/components/stock/stock-image';
import { SymbolItem } from '@/components/stock/symbol-item';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { featuredLinks } from '@/config/layout-content';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { CreateModal } from '../portfolio/create-modal';

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
    <div className="sm:f-col sticky top-16 z-20 hidden h-screen w-16 gap-3 border-r py-2.5">
      <div className="f-col items-center gap-1">
        {featuredLinks.map((link) => (
          <TooltipProvider key={link.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  aria-label={link.title}
                  className="f-center gap-2 rounded-md p-2 hover:bg-accent"
                >
                  {link.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {link.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <Separator />

      <div className="f-col items-center gap-1">
        {user ? (
          (dbUser?.portfolios.length ?? 0) >= 0 ? (
            dbUser?.portfolios?.map((portfolio) => (
              <TooltipProvider key={portfolio.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/p/${portfolio.id}`}>
                      <Card className="p-1.5 hover:bg-accent">
                        <PortfolioImage portfolio={portfolio} px={25} />
                      </Card>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    className="p-1.5 pl-2 pr-3"
                    side="right"
                    sideOffset={10}
                  >
                    <PortfolioItem portfolio={portfolio} size="sm" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="small-icon" aria-label="Create portfolio">
                  <Plus className="size-4" />
                </Button>
              </DialogTrigger>
              <CreateModal />
            </Dialog>
          )
        ) : (
          <Link
            href="/sign-in"
            aria-label="Create portfolio"
            className={buttonVariants({ size: 'small-icon' })}
          >
            <Plus className="size-4" />
          </Link>
        )}
      </div>

      <Separator />

      <div className="f-col items-center gap-1">
        {user &&
          dbUser?.recentStocks?.map(({ stock }) => (
            <TooltipProvider key={stock.symbol}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/stocks/${stock.symbol}`}>
                    <Card className="p-1.5 hover:bg-accent">
                      <StockImage src={stock.image} px={25} />
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="p-1.5 pl-2 pr-3"
                  side="right"
                  sideOffset={10}
                >
                  <SymbolItem stock={stock} size="sm" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
    </div>
  );
};
