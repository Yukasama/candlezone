'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Form, FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { SignInSchema } from '@/lib/validators/user'
import { useState } from 'react'
import { login } from '@/actions/auth/login'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Chip } from '../ui/chip'
import { Mail } from 'lucide-react'
import { PasswordInput } from './password-input'
import { EmailInput } from './email-input'

export const SignIn = () => {
  const [error, setError] = useState<string | undefined>('')

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async () => {
      return await login({
        email: form.getValues('email'),
        password: form.getValues('password'),
      })
    },
    onSettled: (data) => {
      setError('')
      if (data && 'error' in data) {
        return setError(data.error)
      }
      if (data && 'success' in data) {
        router.push('/dashboard')
      }
    },
    onError: () => toast.error('We have trouble signing you in.'),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => signIn())}
        className="gap-2 md:gap-3 f-col"
      >
        {error && <Chip message={error} isError />}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <EmailInput field={field} isPending={isPending} />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <PasswordInput field={field} isPending={isPending} />
          )}
        />
        <Link
          href="/forgot-password"
          className="text-[13px] text-end hover:underline underline-offset-3"
        >
          Forgot Password?
        </Link>
        <Button className="mt-1" isLoading={isPending}>
          {!isPending && <Mail size={18} className="mr-1" />}
          Sign in with Email
        </Button>
      </form>
    </Form>
  )
}
