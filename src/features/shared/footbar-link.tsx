'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  title: string;
  href: string;
  icon: ReactNode;
}

export const FootbarLink = ({ title, href, icon }: Readonly<Props>) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'f-col w-16 items-center gap-0.5 rounded-md p-1.5 font-bold hover:bg-accent hover:text-primary',
        (href === pathname ||
          (title === 'Portfolio' && pathname.includes('/p/'))) &&
          'bg-accent text-primary',
      )}
    >
      {icon}
      <p className="text-xs">{title}</p>
    </Link>
  );
};
