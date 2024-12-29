'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes';
import { register } from '@/features/auth/actions/register';
import { EmailInput } from '@/features/auth/components/email-input';
import { PasswordInput } from '@/features/auth/components/password-input';
import { SignUpSchema } from '@/features/user/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confPassword: '',
    },
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async () => {
      return await register({
        email: form.getValues('email'),
        password: form.getValues('password'),
      });
    },
    onSettled: (data) => {
      setError('');
      setSuccess('');
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success) {
        router.push(DEFAULT_LOGIN_REDIRECT);
      }
    },
    onError: () => {
      setError('We currently have trouble signing you up.');
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          createUser();
        })}
        className="f-col gap-2 md:gap-3"
      >
        {error && <Chip message={error} isError />}
        {success && <Chip message={success} />}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <EmailInput field={field} isPending={isPending} />
          )}
        />
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
        <Button className="mt-1" isLoading={isPending}>
          {!isPending && <Mail size={18} className="mr-1" />}
          Sign up with Email
        </Button>
      </form>
    </Form>
  );
}
