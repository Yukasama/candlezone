import { CompanyLogo } from '@/components/company-logo';
import { PortfolioItem } from '@/components/portfolio/portfolio-item';
import { SymbolItem } from '@/components/stock/symbol-item';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { featuredLinks } from '@/config/layout-content';
import { siteConfig } from '@/config/site';
import { Portfolio, Stock } from '@prisma/client';
import { Menu } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';

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
        <Button size="icon" variant="ghost" aria-label="Open sidebar">
          <Menu size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="f-col w-[300px] justify-between rounded-r-lg sm:w-[400px]"
      >
        <div className="f-col gap-4 overflow-auto">
          <div className="f-center gap-3">
            <CompanyLogo px={35} />
            <p className="text-lg">{siteConfig.name}</p>
          </div>

          <div className="f-col gap-1">
            {featuredLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="flex h-9 w-full items-center gap-2 rounded-md p-1 px-2.5 hover:bg-accent"
              >
                {link.icon}
                <p className="text-[15px]">{link.title}</p>
              </Link>
            ))}
          </div>

          <Separator />

          <div className="f-col gap-2">
            <p className="text-medium">PORTFOLIOS</p>
            {user ? (
              <div className="f-col max-h-72 gap-2 scroll-auto">
                {portfolios?.map((portfolio) => (
                  <Link
                    key={portfolio.id}
                    className="w-full"
                    href={`/p/${portfolio.id}`}
                  >
                    <Card className="p-1.5 px-2 hover:bg-accent">
                      <PortfolioItem portfolio={portfolio} size="sm" />
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-center text-sm text-gray-400 hover:underline"
              >
                Sign in to create portfolios
              </Link>
            )}
          </div>

          <Separator />

          <div className="f-col gap-2">
            <p className="text-medium">RECENT STOCKS</p>
            {user ? (
              <div className="f-col max-h-72 gap-2 scroll-auto">
                {recentStocks?.map((stock) => (
                  <Link
                    key={stock.symbol}
                    className="w-full"
                    href={`/stocks/${stock.symbol}`}
                  >
                    <Card className="p-1.5 px-2 hover:bg-accent">
                      <SymbolItem stock={stock} size="sm" />
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-center text-sm text-gray-400 hover:underline"
              >
                Sign in to view recent stocks
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
