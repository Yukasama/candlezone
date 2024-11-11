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

  useEffect(() => {
    setMounted(true);
    if (token && mounted) {
      setVerified({ token });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mounted]);

  const { mutate: setVerified, isPending } = useMutation({
    mutationFn: verifyEmail,
    onError: () => setError('Email could not be verified.'),
    onSuccess: ({ error }) => {
      if (error) {
        return setError(error);
      }
    },
  });

  return (
    <>
      {(isPending || !mounted) && (
        <div className="f-center gap-2 text-gray-400">
          <Loader size={20} />
          Verifying Email...
        </div>
      )}
      {!isPending &&
        mounted &&
        ((error ?? !token) ? (
          <div className="f-col gap-2">
            <div className="f-box h-10 w-10 self-center rounded-full bg-red-500">
              <X />
            </div>
            <div className="f-col items-center">
              <p className="text-xl font-semibold">
                No or invalid token provided.
              </p>
              <p className="text-[16px] text-gray-400">
                Please check the URL and try again.
              </p>
            </div>
          </div>
        ) : (
          <div className="f-col gap-2">
            <div className="f-box h-10 w-10 self-center rounded-full bg-green-500">
              <CheckCircle />
            </div>
            <div className="f-col items-center">
              <p className="text-xl font-semibold">
                Email verified successfully.
              </p>
              <p className="text-[16px] text-gray-400">
                You can now close this tab.
              </p>
            </div>
          </div>
        ))}
    </>
  );
}
