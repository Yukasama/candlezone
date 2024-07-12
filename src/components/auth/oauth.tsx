'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import capitalize from 'lodash/capitalize'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import type { HTMLAttributes } from 'react'
import { toast } from 'sonner'

interface Props extends HTMLAttributes<HTMLDivElement> {
  provider: 'google' | 'facebook' | 'github'
}

/**
 * OAuth button to sign in with a specified provider.
 * @param provider Provider to sign in with.
 */
export const OAuth = ({ provider, className }: Readonly<Props>) => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const { mutate: login, isPending } = useMutation({
    mutationFn: async () => {
      await signIn(provider, {
        callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
      })
    },
    onError: () => toast.error('We have trouble signing you in.'),
  })

  return (
    <Button
      isLoading={isPending}
      variant="secondary"
      aria-label={`Sign in with ${capitalize(provider)}`}
      className={cn('gap-3', className)}
      onClick={() => login()}
    >
      {!isPending && (
        <>
          {provider === 'google' && <Icons.Google className="h-[18px]" />}
          {provider === 'facebook' && <Icons.Facebook className="h-[18px]" />}
          {provider === 'github' && <Icons.Github className="h-[18px]" />}
          Sign in with {capitalize(provider)}
        </>
      )}
    </Button>
  )
}
