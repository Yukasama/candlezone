'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { resetPassword } from '@/features/auth/actions/reset-password';
import { AuthCard } from '@/features/auth/components/auth-card';
import { PasswordInput } from '@/features/auth/components/password-input';
import { NewPasswordSchema } from '@/features/user/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ResetPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      confPassword: '',
    },
  });

  const { mutate: newPassword, isPending } = useMutation({
    mutationFn: resetPassword,
    onError: () => setError('Password could not be reset.'),
    onSuccess: ({ error }) => {
      if (error) {
        return setError('Password could not be reset.');
      }
      setSuccess(true);
    },
  });

  return success ? (
    <div className="f-col gap-2">
      <div className="f-box h-10 w-10 self-center rounded-full bg-green-500">
        <CheckCircle />
      </div>
      <div className="f-col items-center">
        <p className="text-xl font-semibold">Password successfully reset.</p>
        <p className="text-[16px] text-gray-400">You can now close this tab.</p>
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
            }),
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
              <PasswordInput field={field} isPending={isPending} isConfirm />
            )}
          />
          <Button isLoading={isPending} className="mt-2">
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
