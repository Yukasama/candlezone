'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  title: string;
  href: string;
  icon: ReactNode;
  isMobile?: boolean;
}

export const SidebarLink = ({ title, href, icon, isMobile = false }: Props) => {
  const pathname = usePathname();
  const isActive = href === pathname || (pathname === '/' && title === 'Home');

  if (isMobile) {
    return (
      <SheetClose asChild>
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
            isActive && 'bg-accent',
            'justify-start gap-2',
          )}
        >
          {icon}
          <p className="text-sm sm:text-[15px]">{title}</p>
        </Link>
      </SheetClose>
    );
  }

  return (
    <CustomTooltip key={title} content={title}>
      <Link
        href={href}
        aria-label={title}
        className={cn(
          buttonVariants({ size: 'icon', variant: 'ghost' }),
          isActive && 'bg-accent',
        )}
      >
        {icon}
      </Link>
    </CustomTooltip>
  );
};
