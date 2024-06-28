'use client'

import { forgotPassword } from '@/actions/auth/forgot-password'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Form, FormField } from '@/components/ui/form'
import { ForgotPasswordSchema } from '@/lib/validators/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { EmailInput } from '../../components/auth/email-input'

export const ForgotPassword = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const { mutate: sendMail, isPending } = useMutation({
    mutationFn: forgotPassword,
    onError: () => setError('Email could not be sent.'),
    onSuccess: () => setSuccess('Reset Email successfully sent.'),
  })

  return (
    <div className="f-col gap-4">
      {error && <Chip message={error} isError />}
      {success && <Chip message={success} />}
      {!success && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() =>
              sendMail({ email: form.getValues('email') })
            )}
            className="f-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <EmailInput field={field} isPending={isPending} />
              )}
            />
            <Button isLoading={isPending}>Send Password Link</Button>
          </form>
        </Form>
      )}
      <div className="f-box gap-1.5 text-sm">
        <p className="text-gray-400">
          {success ? 'Password successfully changed?' : 'Already signed up?'}
        </p>
        <Link href="/sign-in" className="font-medium">
          {success ? 'Head to Login.' : 'Sign In.'}
        </Link>
      </div>
    </div>
  )
}
