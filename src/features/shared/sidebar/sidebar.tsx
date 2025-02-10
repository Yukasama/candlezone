import { CompanyLogo } from '@/components/company-logo';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Suspense } from 'react';
import { SidebarLink } from '../components/sidebar-link';
import { featuredLinks } from '../config/layout-links';
import { SidebarPortfolios } from './sidebar-portfolios';
import { SidebarRecents } from './sidebar-recents';

export const Sidebar = () => {
  return (
    <div className="sticky top-0 z-20 hidden h-screen min-w-16 flex-col items-center gap-3 border-r py-4 sm:flex">
      <Link className="pb-1" href="/">
        <CompanyLogo px={28} />
      </Link>

      <div className="flex flex-col items-center gap-1">
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
