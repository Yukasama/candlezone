'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  href: string;
  icon: ReactNode;
  isMobile?: boolean;
  title: string;
}

export const SidebarLink = ({ href, icon, isMobile = false, title }: Props) => {
  const pathname = usePathname();
  const isActive = href === pathname || (pathname === '/' && title === 'Home');

  if (isMobile) {
    return (
      <SheetClose asChild>
        <Link
          className={cn(
            buttonVariants({ size: 'icon-sm', variant: 'ghost' }),
            isActive && 'bg-accent',
            'justify-start gap-2',
          )}
          href={href}
        >
          {icon}
          <p className="text-sm sm:text-[15px]">{title}</p>
        </Link>
      </SheetClose>
    );
  }

  return (
    <CustomTooltip content={title} key={title}>
      <Link
        aria-label={title}
        className={cn(
          buttonVariants({ size: 'icon', variant: 'ghost' }),
          isActive && 'bg-accent',
        )}
        href={href}
      >
        {icon}
      </Link>
    </CustomTooltip>
  );
};
