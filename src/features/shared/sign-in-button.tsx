'use client';

import { authRoutes } from '@/config/routes';
import { Link } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLLinkElement>, PropsWithChildren {
  text?: string;
}

export const SignInButton = ({ children, className, text }: Props) => {
  const pathname = usePathname();

  const forbiddenReferrers = new Set(['/dashboard', ...authRoutes]);
  const includeReferrer = forbiddenReferrers.has(pathname);

  return (
    <Link
      aria-label={text ?? 'Sign In'}
      className={className}
      href={includeReferrer ? '/sign-in' : `/sign-in?redirect=${pathname}`}
    >
      {text ?? children}
    </Link>
  );
};
