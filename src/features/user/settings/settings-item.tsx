'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  id: string;
  label: string;
  icon: ReactNode;
}

export const SettingsItem = ({ id, label, icon }: Readonly<Props>) => {
  const pathname = usePathname();

  return (
    <Link
      key={id}
      href={`/settings/${id === 'settings' ? '' : id}`}
      className={cn(
        'text-md f-center gap-2.5 rounded-md p-1.5 px-2.5 hover:bg-accent',
        pathname.split('/').pop() === id && 'bg-gray-100 dark:bg-gray-800',
      )}
    >
      {icon}
      {label}
    </Link>
  );
};
