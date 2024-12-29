'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { forgotPassword } from '@/features/auth/actions/forgot-password';
import { EmailInput } from '@/features/auth/components/email-input';
import { ForgotPasswordSchema } from '@/features/user/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { mutate: sendMail, isPending } = useMutation({
    mutationFn: forgotPassword,
    onError: () => {
      setError('Email could not be sent.');
    },
    onSuccess: () => {
      setSuccess('Reset Email successfully sent.');
    },
  });

  return (
    <div className="space-y-4">
      {error && <Chip message={error} isError />}
      {success && <Chip message={success} />}
      {!success && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {
              sendMail({ email: form.getValues('email') });
            })}
            className="space-y-4"
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
  );
}
