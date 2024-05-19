'use client'

import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { cn } from '@/utils/cn'
import { Button } from '@nextui-org/button'
import { Icons } from '@/components/shared/icons'
import { useMutation } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes'
import type { HTMLAttributes } from 'react'
import capitalize from 'lodash/capitalize'

interface Props extends HTMLAttributes<HTMLDivElement> {
  provider: 'google' | 'facebook' | 'github'
}

const providerIcons = {
  google: <Icons.Google className="h-[18px]" />,
  facebook: <Icons.Facebook className="h-[18px]" />,
  github: <Icons.Github className="dark:invert h-[18px]" />,
}

/**
 * OAuth button to sign in with a specified provider.
 * @param provider Provider to sign in with.
 */
export const OAuth = ({ provider, className }: Readonly<Props>) => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const { mutate: login, isPending } = useMutation({
    mutationFn: async () =>
      await signIn(provider, {
        callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
      }),
    onError: () => toast.error('We have trouble signing you in.'),
  })

  return (
    <Button
      isLoading={isPending}
      variant="flat"
      aria-label={`Sign in with ${capitalize(provider)}`}
      className={cn('gap-3', className)}
      onClick={() => login()}
    >
      {!isPending && (
        <>
          {providerIcons[provider]}
          Sign in with {capitalize(provider)}
        </>
      )}
    </Button>
  )
}
