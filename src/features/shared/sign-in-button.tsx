'use client';

import { authRoutes } from '@/config/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLLinkElement>, PropsWithChildren {}

export const SignInButton = ({ children, className }: Props) => {
  const pathname = usePathname();

  const forbiddenReferrers = new Set(['/dashboard', ...authRoutes]);
  const includeReferrer = forbiddenReferrers.has(pathname);

  return (
    <Link
      aria-label="Sign In"
      className={className}
      href={includeReferrer ? '/sign-in' : `/sign-in?callbackUrl=${pathname}`}
    >
      {children}
    </Link>
  );
};
