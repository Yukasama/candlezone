'use client';

import { ChipMessage } from '@/components/chip';
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { verify2fa as verify2faFn } from './actions/2fa/verify-2fa';
import { CodeInput } from './code-input';

interface Props {
  userId: string;
}

export const TwoFactorForm = ({ userId }: Props) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const { isPending, mutate: verify2fa } = useMutation({
    mutationFn: verify2faFn,
    onError: () => toast.error('We have trouble verifying your code.'),
    onSettled: (data) => {
      setOtp('');
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        router.refresh();
        router.push(DEFAULT_LOGIN_REDIRECT);
      }
    },
  });

  useEffect(() => {
    if (otp.length === 6) {
      verify2fa({ code: otp, userId });
    }
  }, [otp, verify2fa, userId]);

  return (
    <>
      <ChipMessage message={error} />
      <CodeInput isPending={isPending} onChange={setOtp} value={otp} />
    </>
  );
};
