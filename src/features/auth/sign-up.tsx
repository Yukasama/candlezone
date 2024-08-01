'use client'

import { register } from '@/actions/auth/register'
import { EmailInput } from '@/components/auth/email-input'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Form, FormField } from '@/components/ui/form'
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes'
import { SignUpSchema } from '@/lib/validators/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const SignUp = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confPassword: '',
    },
  })

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async () => {
      return await register({
        email: form.getValues('email'),
        password: form.getValues('password'),
      })
    },
    onSettled: (data) => {
      setError('')
      setSuccess('')

      if (data && 'error' in data) {
        return setError(data.error)
      }
      if (data && 'success' in data) {
        router.push(DEFAULT_LOGIN_REDIRECT)
      }
    },
    onError: () => setError('We currently have trouble signing you up.'),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => createUser())}
        className="f-col gap-2 md:gap-3"
      >
        {error && <Chip message={error} isError />}
        {success && <Chip message={success} />}
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
        <FormField
          control={form.control}
          name="confPassword"
          render={({ field }) => (
            <PasswordInput field={field} isPending={isPending} isConfirm />
          )}
        />
        <Button className="mt-1" isLoading={isPending}>
          {!isPending && <Mail size={18} className="mr-1" />}
          Sign up with Email
        </Button>
      </form>
    </Form>
  )
}
