'use client';

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
}

export const SidebarMobileLink = ({ title, href, icon }: Props) => {
  const pathname = usePathname();
  const isActive = href === pathname || (pathname === '/' && title === 'Home');

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
        <p className="text-[15px]">{title}</p>
      </Link>
    </SheetClose>
  );
};
