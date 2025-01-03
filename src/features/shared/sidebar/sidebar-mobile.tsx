import { CompanyLogo } from '@/components/company-logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { siteConfig } from '@/config/site';
import type { Portfolio, Stock } from '@prisma/client';
import { Menu } from 'lucide-react';
import { User } from 'next-auth';
import { Suspense } from 'react';
import { featuredLinks } from '../config/layout-links';
import { SidebarMobileLink } from './sidebar-mobile-link';
import { SidebarMobilePortfolios } from './sidebar-mobile-portfolios';
import { SidebarMobileRecents } from './sidebar-mobile-recents';

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
          aria-label="Open sidebar"
          className="bg-background"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="f-col bg-faded w-[300px] justify-between rounded-r-lg sm:w-[400px]"
      >
        <SheetTitle className="hidden">Mobile Sidebar</SheetTitle>
        <div className="space-y-4 overflow-auto">
          <div className="f-center gap-3">
            <CompanyLogo px={35} />
            <p className="pointer-events-none text-lg">{siteConfig.name}</p>
          </div>

          <div className="space-y-1">
            {featuredLinks.map((link) => (
              <Suspense key={link.title}>
                <SidebarMobileLink {...link} />
              </Suspense>
            ))}
          </div>

          <Separator />
          <SidebarMobilePortfolios user={user} portfolios={portfolios} />
          <Separator />
          <SidebarMobileRecents user={user} recentStocks={recentStocks} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
