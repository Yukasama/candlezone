'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes';
import { register } from '@/features/auth/actions/register';
import { EmailInput } from '@/features/auth/components/email-input';
import { PasswordInput } from '@/features/auth/components/password-input';
import { RegisterProps, SignUpSchema } from '@/features/auth/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignUpPage() {
  const [error, setError] = useState('');
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
      if (data?.success) {
        router.replace(DEFAULT_LOGIN_REDIRECT);
        router.refresh();
      }
    },
  });

  const onSubmit = (values: RegisterProps) => {
    createUser(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 md:gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {(urlError || error) && <Chip isError message={urlError || error} />}

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
