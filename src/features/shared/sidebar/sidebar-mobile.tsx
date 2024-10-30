import { CompanyLogo } from '@/components/company-logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { siteConfig } from '@/config/site';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import { Portfolio, Stock } from '@prisma/client';
import { Menu } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { featuredLinks } from './layout-links';

interface Props {
  user?: User;
  portfolios?: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>[];
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
}

export const SidebarMobile = ({
  user,
  portfolios,
  recentStocks,
}: Readonly<Props>) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Open Sidebar"
          className="bg-background"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="f-col w-[300px] justify-between rounded-r-lg sm:w-[400px]"
      >
        <SheetTitle className="hidden">Mobile Sidebar</SheetTitle>
        <div className="f-col gap-4 overflow-auto">
          <div className="f-center gap-3">
            <CompanyLogo px={35} />
            <p className="pointer-events-none text-lg">{siteConfig.name}</p>
          </div>

          <div className="f-col gap-1">
            {featuredLinks.map((link) => (
              <SheetClose key={link.title} asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'icon-sm',
                    }),
                    'justify-start gap-2',
                  )}
                >
                  {link.icon}
                  <p className="text-[15px]">{link.title}</p>
                </Link>
              </SheetClose>
            ))}
          </div>

          <Separator />

          <div className="f-col gap-2">
            <p className="text-sm font-medium text-gray-500">PORTFOLIOS</p>
            {user ? (
              (portfolios?.length ?? 0) > 0 ? (
                <div className="f-col gap-1">
                  {portfolios?.map((portfolio) => (
                    <SheetClose key={portfolio.id} asChild>
                      <Link
                        href={`/p/${portfolio.id}`}
                        className={cn(
                          buttonVariants({
                            variant: 'ghost',
                            size: 'lg',
                          }),
                          'justify-start gap-2 p-1.5 px-2',
                        )}
                      >
                        <PortfolioItem portfolio={portfolio} size="sm" />
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/p/new"
                    className={buttonVariants({ size: 'sm' })}
                  >
                    Create your first portfolio
                  </Link>
                </SheetClose>
              )
            ) : (
              <SheetClose asChild>
                <Link
                  href="/sign-in"
                  className="text-center text-sm text-gray-400 hover:underline"
                >
                  Sign in to create portfolios
                </Link>
              </SheetClose>
            )}
          </div>

          <Separator />

          <div className="f-col gap-2">
            <p className="text-sm font-medium text-gray-500">RECENT STOCKS</p>
            {user ? (
              (recentStocks?.length ?? 0) > 0 ? (
                <div className="f-col gap-1.5">
                  {recentStocks?.map((stock) => (
                    <SheetClose key={stock.symbol} asChild>
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className={cn(
                          buttonVariants({
                            variant: 'ghost',
                            size: 'lg',
                          }),
                          'justify-start gap-2 p-1.5 px-2',
                        )}
                      >
                        <SymbolItem stock={stock} size="sm" />
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  Stocks you viewed will appear here.
                </div>
              )
            ) : (
              <SheetClose asChild>
                <Link
                  href="/sign-in"
                  className="text-center text-sm text-gray-400 hover:underline"
                >
                  Sign in to view recent stocks
                </Link>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
