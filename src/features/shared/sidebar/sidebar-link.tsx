'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { buttonVariants } from '@/components/ui/button';
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
          buttonVariants({ size: 'icon', variant: 'ghost' }),
          (href === pathname || (pathname === '/' && title === 'Home')) &&
            'bg-accent',
        )}
      >
        {icon}
      </Link>
    </CustomTooltip>
  );
};
