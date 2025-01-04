import { CompanyLogo } from '@/components/company-logo';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Suspense } from 'react';
import { featuredLinks } from '../config/layout-links';
import { SidebarLink } from './sidebar-link';
import { SidebarPortfolios } from './sidebar-portfolios';
import { SidebarRecents } from './sidebar-recents';

export const Sidebar = () => {
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
      <SidebarPortfolios />
      <Separator className="w-12" />
      <SidebarRecents />
    </div>
  );
};
