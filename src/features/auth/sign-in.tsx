'use client'

import { login } from '@/actions/auth/login'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { SignInSchema } from '@/lib/validators/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { EmailInput } from '../../components/auth/email-input'
import { PasswordInput } from '../../components/auth/password-input'
import { Chip } from '../../components/ui/chip'

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
        className="f-col gap-2 md:gap-3"
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
          className="underline-offset-3 text-end text-[13px] hover:underline"
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
