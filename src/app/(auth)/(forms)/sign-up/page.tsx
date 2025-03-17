'use client';

import { ChipMessage } from '@/components/chip';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { register } from '@/features/auth/actions/register';
import { EmailInput } from '@/features/auth/components/email-input';
import { PasswordInput } from '@/features/auth/components/password-input';
import { RegisterProps, SignUpSchema } from '@/features/auth/lib/validators';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const searchParams = useSearchParams();
  const urlParam = searchParams.get('error');

  let urlError = '';
  if (urlParam === 'OAuthAccountNotLinked') {
    urlError = 'This email is already used by another provider.';
  } else if (urlParam) {
    urlError = 'Oops, something went wrong!';
  }

  const form = useForm({
    defaultValues: {
      confPassword: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(SignUpSchema),
  });

  const { isPending, mutate: createUser } = useMutation({
    mutationFn: register,
    onError: () => setError('We currently have trouble signing you up.'),
    onSettled: (data) => {
      setError('');
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success && data.success === 'Confirmation email sent!') {
        setSuccess(data.success);
      }
    },
  });

  const onSubmit = (values: RegisterProps) => {
    if (!form.formState.isValid) {
      return;
    }

    createUser(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 md:gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ChipMessage>{urlError || error}</ChipMessage>

        {success && (
          <div className="flex flex-col items-center">
            <ChipMessage type="success">{success}</ChipMessage>
            <div className="flex items-center gap-1.5 text-sm">
              <p className="text-desc">Email verified?</p>
              <Link
                className={cn(buttonVariants({ variant: 'link' }), 'p-0')}
                href="/sign-in"
              >
                Head to login.
              </Link>
            </div>
          </div>
        )}

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

        <Button className="mt-1" isLoading={isPending} showNextArrow>
          Sign up with Email
        </Button>
      </form>
    </Form>
  );
}
