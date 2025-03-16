'use client';

import { ChipMessage } from '@/components/chip';
import { DialogButtons } from '@/components/dialog-buttons';
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
import { useState } from 'react';
import { generateQrCode } from './actions/2fa/qrcode';
import { enable2fa as verify2faFn } from './actions/2fa/enable-2fa';

export const TwoFactorModal = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');

  const { data, isFetching } = useQuery({
    queryFn: generateQrCode,
    queryKey: ['generateQrCode'],
  });

  const { isPending, mutate: verify2fa } = useMutation({
    mutationFn: verify2faFn,
    onSuccess: (data) => {
      if (data.verified) {
        setSuccess('2FA enabled successfully!');
      }
      if (data.error) {
        setError(data.error);
      }
    },
  });

  const onSubmit = () => {
    if (otp.length === 6 && data?.secret) {
      verify2fa({ secret: data.secret, token: otp });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add TOTP</Button>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title="Use an Authenticator App to enable 2FA"
      >
        <div className="flex flex-col gap-2">
          {data?.data && !isFetching && (
            <Image
              alt="2FA QR Code"
              className="rounded-lg border-2"
              height={200}
              src={data.data}
              width={200}
            />
          )}

          <form onSubmit={onSubmit}>
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

            <ChipMessage>{error}</ChipMessage>
            <ChipMessage type="success">{success}</ChipMessage>

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

            <DialogButtons
              buttonLoadingText="Confirming"
              buttonText="Confirm"
              isPending={isPending}
              setOpen={setOpen}
            />
          </form>
        </div>
      </ResponsiveDialog>
    </>
  );
};
