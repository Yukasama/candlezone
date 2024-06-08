'use client'

import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { Form, FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { NewPasswordSchema } from '@/lib/validators/user'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '@/actions/auth/reset-password'
import { Chip } from '@/components/ui/chip'
import { AuthCard } from '../../components/auth/auth-card'
import { PasswordInput } from '../../components/auth/password-input'

export const ResetPassword = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      confPassword: '',
    },
  })

  const { mutate: newPassword, isPending } = useMutation({
    mutationFn: resetPassword,
    onError: () => setError('Password could not be reset.'),
    onSuccess: () => setSuccess(true),
  })

  return (
    <>
      {success ? (
        <div className="f-col gap-2">
          <div className="f-box h-10 w-10 self-center rounded-full bg-green-500">
            <CheckCircle />
          </div>
          <div className="f-col items-center">
            <p className="text-xl font-semibold">
              Password successfully reset.
            </p>
            <p className="text-[16px] text-gray-400">
              You can now close this tab.
            </p>
          </div>
        </div>
      ) : (
        <AuthCard
          header="Reset your Password"
          subHeader="This will replace your old password."
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() =>
                newPassword({
                  password: form.getValues('password'),
                  token,
                })
              )}
              className="f-col gap-2 md:gap-3"
            >
              {error && <Chip message={error} isError />}
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
                  <PasswordInput
                    field={field}
                    isPending={isPending}
                    isConfirm
                  />
                )}
              />
              <Button isLoading={isPending} className="mt-2">
                Reset Password
              </Button>
            </form>
          </Form>
        </AuthCard>
      )}
    </>
  )
}
