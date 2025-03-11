'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { forgotPassword } from '@/features/auth/actions/forgot-password';
import { EmailInput } from '@/features/auth/components/email-input';
import {
  ForgotPasswordProps,
  ForgotPasswordSchema,
} from '@/features/auth/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { isPending, mutate: sendMail } = useMutation({
    mutationFn: forgotPassword,
    onError: () => setError('Email could not be sent.'),
    onSuccess: () => setSuccess('Reset Email successfully sent.'),
  });

  const onSubmit = (values: ForgotPasswordProps) => {
    sendMail(values);
  };

  return (
    <div className="space-y-4">
      {error && <Chip isError message={error} />}
      {success && <Chip message={success} />}

      {!success && (
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <EmailInput
                  error={form.formState.errors.email?.message}
                  field={field}
                  isPending={isPending}
                />
              )}
            />
            <Button isLoading={isPending}>Send Password Link</Button>
          </form>
        </Form>
      )}

      <div className="flex items-center justify-center gap-1.5 text-sm">
        <p className="text-desc">
          {success ? 'Password successfully changed?' : 'Already signed up?'}
        </p>
        <Link className="font-medium" href="/sign-in">
          {success ? 'Head to Login.' : 'Sign In.'}
        </Link>
      </div>
    </div>
  );
}
