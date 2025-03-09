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
import { Menu } from 'lucide-react';
import { Suspense } from 'react';
import { SidebarLink } from '../../../components/sidebar-link';
import { featuredLinks } from '../config/layout-links';
import { SidebarMobilePortfolios } from './sidebar-mobile-portfolios';
import { SidebarMobileRecents } from './sidebar-mobile-recents';

export const SidebarMobile = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open sidebar"
          className="bg-background"
          size="icon"
          variant="ghost"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent
        aria-describedby={undefined}
        className="bg-faded flex w-[300px] flex-col justify-between rounded-r-lg sm:w-[400px]"
        side="left"
      >
        <SheetTitle className="sr-only">Mobile Sidebar</SheetTitle>
        <div className="space-y-4 overflow-auto">
          <div className="flex items-center gap-3">
            <CompanyLogo px={35} />
            <p className="pointer-events-none text-lg">{siteConfig.name}</p>
          </div>

          <div className="space-y-1">
            {featuredLinks.map((link) => (
              <Suspense key={link.title}>
                <SidebarLink {...link} isMobile />
              </Suspense>
            ))}
          </div>

          <Separator />
          <SidebarMobilePortfolios />
          <Separator />
          <SidebarMobileRecents />
        </div>
      </SheetContent>
    </Sheet>
  );
};
