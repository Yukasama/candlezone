'use client';

import { ChipMessage } from '@/components/chip';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { verify2fa } from './actions/2fa/verify-2fa';
import { CodeInput } from './code-input';

export const TwoFactorForm = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const { isPending, mutate: verify } = useMutation({
    mutationFn: verify2fa,
    onError: () => toast.error('We have trouble verifying your code.'),
    onSettled: (data) => {
      setOtp('');
      if (data?.error) {
        setError(data.error);
      }
    },
  });

  useEffect(() => {
    if (otp.length === 6) {
      verify({ code: otp, userId: 'cm84h23iz0008f9yk2k6sdwxa' });
    }
  }, [otp, verify]);

  return (
    <>
      <ChipMessage message={error} />
      <CodeInput isPending={isPending} onChange={setOtp} value={otp} />
    </>
  );
};
