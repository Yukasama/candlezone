'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { login } from '@/features/auth/actions/login';
import { EmailInput } from '@/features/auth/components/email-input';
import { PasswordInput } from '@/features/auth/components/password-input';
import {
  PasswordSchema,
  SignInProps,
  SignInSchema,
} from '@/features/auth/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignInPage() {
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

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(SignInSchema),
  });

  const { isPending, mutate: signIn } = useMutation({
    mutationFn: login,
    onError: () => toast.error('We have trouble signing you in.'),
    onSettled: (data) => {
      setError('');
      setSuccess('');
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success && data.success === 'Confirmation email sent.') {
        setSuccess(data.success);
      }
    },
  });

  const onSubmit = async (values: SignInProps) => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    try {
      PasswordSchema.parse(values.password);
      signIn(values);
    } catch {
      setError('Invalid credentials.');
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 md:gap-3"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {(urlError || error) && <Chip isError message={urlError || error} />}
        {success && <Chip message={success} />}

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
              isLogin
              isPending={isPending}
            />
          )}
        />
        <Link
          className="text-end text-[13px] underline-offset-3 hover:underline"
          href="/forgot-password"
        >
          Forgot Password?
        </Link>

        <Button className="mt-1" isLoading={isPending} showNextArrow>
          Sign in with Email
        </Button>
      </form>
    </Form>
  );
}
