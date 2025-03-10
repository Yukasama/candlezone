'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import capitalize from 'lodash/capitalize';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import type { HTMLAttributes } from 'react';
import { toast } from 'sonner';

interface Props extends HTMLAttributes<HTMLDivElement> {
  provider: 'github' | 'google';
}

/**
 * OAuth button to sign in with a specified provider.
 * @param provider Provider to sign in with.
 */
export const OAuth = ({ className, provider }: Readonly<Props>) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const { isPending, mutate: login } = useMutation({
    mutationFn: async () => {
      await signIn(provider, {
        callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
      });
    },
    onError: () => toast.error('We have trouble signing you in.'),
  });

  return (
    <Button
      aria-label={`Sign in with ${capitalize(provider)}`}
      className={cn('flex-1 gap-2.5', className)}
      isLoading={isPending}
      onClick={() => login()}
      variant="secondary"
    >
      {!isPending && (
        <>
          {provider === 'google' && <Icons.Google className="size-5" />}
          {provider === 'github' && (
            <Icons.Github className="size-5 dark:invert" />
          )}
          Sign in with {capitalize(provider)}
        </>
      )}
    </Button>
  );
};
