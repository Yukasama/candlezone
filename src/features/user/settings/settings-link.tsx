'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface Props {
  href: string;
  icon: ReactNode;
  label: string;
}

export const SettingsLink = ({ href, icon, label }: Props) => {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        'text-muted-foreground hover:lg:bg-accent hover:lg:text-primary flex h-9 w-full items-center justify-center gap-2 rounded-full px-3 lg:justify-start',
        pathname === href && 'bg-accent text-primary',
      )}
      href={href}
    >
      {icon}
      {label}
    </Link>
  );
};
