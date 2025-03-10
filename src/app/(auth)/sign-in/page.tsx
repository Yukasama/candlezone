'use client';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/features/auth/actions/login';
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
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(SignInSchema),
  });

  const { isPending, mutate: signIn } = useMutation({
    mutationFn: login,
    onError: () => toast.error('We have trouble signing you in.'),
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
  });

  const onSubmit = async (values: SignInProps) => {
    await form.trigger();
    signIn(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 md:gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {error && <Chip isError message={error} />}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="john.doe@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <PasswordInput field={field} isLogin isPending={isPending} />
          )}
        />
        <Link
          className="text-end text-[13px] underline-offset-3 hover:underline"
          href="/forgot-password"
        >
          Forgot Password?
        </Link>

        <Button isLoading={isPending}>
          {!isPending && <Mail className="mr-1" size={18} />}
          Sign in with Email
        </Button>
      </form>
    </Form>
  );
}
