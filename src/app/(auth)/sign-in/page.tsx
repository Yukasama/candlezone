'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { login } from '@/features/auth/actions/login';
import { EmailInput } from '@/features/auth/components/email-input';
import { PasswordInput } from '@/features/auth/components/password-input';
import { SignInProps, SignInSchema } from '@/features/auth/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignInPage() {
  const [error, setError] = useState('');

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: login,
    onSettled: (data) => {
      setError('');
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success) {
        router.replace('/dashboard');
        router.refresh();
      }
    },
    onError: () => toast.error('We have trouble signing you in.'),
  });

  const onSubmit = (values: SignInProps) => {
    signIn(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 md:gap-3"
      >
        {error && <Chip message={error} isError />}

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
            <PasswordInput field={field} isPending={isPending} isLogin />
          )}
        />
        <Link
          href="/forgot-password"
          className="text-end text-[13px] underline-offset-3 hover:underline"
        >
          Forgot Password?
        </Link>

        <Button className="mt-1" isLoading={isPending}>
          {!isPending && <Mail size={18} className="mr-1" />}
          Sign in with Email
        </Button>
      </form>
    </Form>
  );
}
