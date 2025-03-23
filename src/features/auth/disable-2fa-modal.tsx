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
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useEffect, useState } from 'react';
import { disable2fa as disable2faFn } from './actions/2fa/disable-2fa';

export const Disable2faModal = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');

  const { isPending, mutate: disable2fa } = useMutation({
    mutationFn: disable2faFn,
    onSuccess: (data) => {
      setOtp('');
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess('2FA disabled successfully!');
      }
    },
  });

  useEffect(() => {
    if (otp.length === 6) {
      disable2fa({ code: otp });
    }
  }, [otp, disable2fa]);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="icon-sm" variant="secondary">
        Disable
      </Button>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title="Enter your 2FA code to disable two factor verification"
      >
        <div className="flex flex-col gap-2">
          <ChipMessage>{error}</ChipMessage>
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
      </ResponsiveDialog>
    </>
  );
};
