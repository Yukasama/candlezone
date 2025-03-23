'use client';

import { ChipMessage } from '@/components/chip-message';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes';
import { verify2fa as verify2faFn } from '@/features/auth/actions/2fa/verify-2fa';
import { login } from '@/features/auth/actions/login';
import { CodeInput } from '@/features/auth/code-input';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignInPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTotp, setShowTotp] = useState(false);
  const [code, setCode] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlParam = searchParams.get('error');

  let urlError = '';
  if (urlParam === 'OAuthAccountNotLinked') {
    urlError = 'This email is already used by another provider.';
  } else if (urlParam) {
    urlError = 'Oops, something went wrong!';
  }

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
    onSuccess: ({ error, success, twoFactor }) => {
      setError('');
      setSuccess('');
      if (error) {
        setError(error);
        return;
      }
      if (success && success === 'Confirmation email sent!') {
        form.reset();
        setSuccess(success);
      }
      if (twoFactor) {
        setShowTotp(true);
      }
      if (success) {
        router.push(callbackUrl ?? DEFAULT_LOGIN_REDIRECT);
        router.refresh();
      }
    },
  });

  const { isPending: is2faPending, mutate: verify2fa } = useMutation({
    mutationFn: verify2faFn,
    onError: () => toast.error('We have trouble verifying your code.'),
    onSuccess: ({ error, success }) => {
      setCode('');
      setError('');
      setSuccess('');
      if (error) {
        setError(error);
      }
      if (success) {
        router.push(callbackUrl ?? DEFAULT_LOGIN_REDIRECT);
        router.refresh();
      }
    },
  });

  useEffect(() => {
    if (code.length === 6 && !is2faPending) {
      verify2fa({
        code,
        email: form.getValues('email'),
        password: form.getValues('password'),
      });
    }
  }, [code, is2faPending, verify2fa, form]);

  const onSubmit = (values: SignInProps) => {
    if (!form.formState.isValid) {
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
        <ChipMessage>{urlError || error}</ChipMessage>
        <ChipMessage type="success">{success}</ChipMessage>

        {showTotp ? (
          <div className="mt-5 mb-14 flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold">Enter your TOTP</h3>
            </div>
            <CodeInput
              isPending={is2faPending}
              onChange={setCode}
              value={code}
            />
          </div>
        ) : (
          <>
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
          </>
        )}
      </form>
    </Form>
  );
}
