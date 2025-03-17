'use client';

import { ChipMessage } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { resetPassword } from '@/features/auth/actions/recovery/reset-password';
import { AuthCard } from '@/features/auth/components/auth-card';
import { PasswordInput } from '@/features/auth/components/password-input';
import {
  NewPasswordProps,
  NewPasswordSchema,
} from '@/features/auth/lib/validators';
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
    defaultValues: {
      confPassword: '',
      password: '',
    },
    resolver: zodResolver(NewPasswordSchema),
  });

  const { isPending, mutate: newPassword } = useMutation({
    mutationFn: resetPassword,
    onError: () => setError('Password could not be reset.'),
    onSuccess: ({ error }) => {
      if (error) {
        setError('Password could not be reset.');
        return;
      }
      setSuccess(true);
    },
  });

  const onSubmit = (values: NewPasswordProps) => {
    newPassword({ password: values.password, token });
  };

  return success ? (
    <div className="flex flex-col gap-2">
      <div className="bg-success flex size-10 items-center justify-center self-center rounded-full">
        <CheckCircle />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xl font-semibold">Password successfully reset.</p>
        <p className="text-desc text-[16px]">You can now close this tab.</p>
      </div>
    </div>
  ) : (
    <AuthCard
      header="Reset your Password"
      subHeader="This will replace your old password."
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-2 md:gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ChipMessage>{error}</ChipMessage>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                error={form.formState.errors.password?.message}
                field={field}
                isPending={isPending}
              />
            )}
          />
          <FormField
            control={form.control}
            name="confPassword"
            render={({ field }) => (
              <PasswordInput
                error={form.formState.errors.confPassword?.message}
                field={field}
                isConfirm
                isPending={isPending}
              />
            )}
          />
          <Button className="mt-2" isLoading={isPending}>
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
