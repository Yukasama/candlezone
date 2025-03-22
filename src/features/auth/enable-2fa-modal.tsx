'use client';

import { ChipMessage } from '@/components/chip-message';
import { Loader } from '@/components/loader';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useMutation, useQuery } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { enable2fa as enable2faFn } from './actions/2fa/enable-2fa';
import { generateQrCode } from './actions/2fa/qrcode';

export const Enable2faModal = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');

  const { data, isFetching } = useQuery({
    queryFn: generateQrCode,
    queryKey: ['generateQrCode'],
  });

  const { isPending, mutate: enable2fa } = useMutation({
    mutationFn: enable2faFn,
    onSuccess: (data) => {
      setOtp('');
      if (data.verified) {
        setSuccess('2FA enabled successfully!');
      }
      if (data.error) {
        setError(data.error);
      }
    },
  });

  useEffect(() => {
    if (otp.length === 6 && data?.secret) {
      enable2fa({ secret: data.secret, token: otp });
    }
  }, [otp, enable2fa, data?.secret]);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        Add TOTP
      </Button>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title="Use an Authenticator App to enable 2FA"
      >
        <div className="flex flex-col gap-2">
          <ChipMessage>{error}</ChipMessage>

          {data?.data && !isFetching && (
            <Image
              alt="2FA QR Code"
              className="rounded-lg border-2"
              height={200}
              src={data.data}
              width={200}
            />
          )}

          <ul className="mb-4 list-inside list-none">
            <li className="mb-2">
              <span className="font-bold">Step 1:</span> Scan the QR Code with
              your Authenticator app.
            </li>
            <li className="mb-2">
              <span className="font-bold">Step 2:</span> Enter the code below
              from your app.
            </li>
          </ul>

          <ChipMessage type="success">{success}</ChipMessage>

          <div className="flex items-center gap-2">
            <InputOTP
              disabled={isPending}
              maxLength={6}
              onChange={(value) => setOtp(value)}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {isPending && <Loader />}
          </div>
        </div>

        <div>
          <p>
            If you cannot scan the QR Code, you can also manually enter this
            code.
          </p>
          <p>{data?.secret}</p>
        </div>
      </ResponsiveDialog>
    </>
  );
};
