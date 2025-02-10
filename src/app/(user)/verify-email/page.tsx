'use client';

import { Loader } from '@/components/loader';
import { verifyEmail } from '@/features/auth/actions/verify-email';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { mutate: setVerified, isPending } = useMutation({
    mutationFn: verifyEmail,
    onError: () => {
      setError('Email could not be verified.');
    },
    onSuccess: ({ error }) => {
      if (error) {
        setError(error);
      }
    },
  });

  useEffect(() => {
    setMounted(true);
    if (token && mounted) {
      setVerified({ token });
    }
  }, [token, mounted, setVerified]);

  return (
    <>
      {(isPending || !mounted) && (
        <div className="text-desc flex items-center gap-2">
          <Loader size={20} />
          Verifying Email...
        </div>
      )}
      {!isPending &&
        mounted &&
        (error || !token ? (
          <div className="flex flex-col gap-2">
            <div className="bg-destructive flex size-10 items-center justify-center self-center rounded-full">
              <X />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-semibold">
                No or invalid token provided.
              </p>
              <p className="text-desc text-[16px]">
                Please check the URL and try again.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="bg-success flex size-10 items-center justify-center self-center rounded-full">
              <CheckCircle />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-semibold">
                Email verified successfully.
              </p>
              <p className="text-desc text-[16px]">
                You can now close this tab.
              </p>
            </div>
          </div>
        ))}
    </>
  );
}
