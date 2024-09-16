'use client';

import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  title: string;
  href: string;
  icon: ReactNode;
}

export const SidebarLink = ({ title, href, icon }: Props) => {
  const pathname = usePathname();

  return (
    <CustomTooltip key={title} content={title}>
      <Link
        href={href}
        aria-label={title}
        className={cn(
          'f-center gap-2 rounded-md p-2 hover:bg-accent',
          (href === pathname || (pathname === '/' && title === 'Home')) &&
            'bg-accent',
        )}
      >
        {icon}
      </Link>
    </CustomTooltip>
  );
};
