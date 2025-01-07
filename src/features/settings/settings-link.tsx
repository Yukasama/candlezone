'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  href: string;
  label: string;
}

export const SettingsLink = ({ icon, href, label }: Props) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'f-center h-9 w-full justify-start gap-2 rounded-full px-3 text-muted-foreground hover:bg-accent hover:text-primary',
        pathname === href && 'bg-accent text-primary',
      )}
    >
      {icon}
      {label}
    </Link>
  );
};
