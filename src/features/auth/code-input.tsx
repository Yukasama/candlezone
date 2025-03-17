'use client';

import { Loader } from '@/components/loader';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  isPending: boolean;
  onChange: Dispatch<SetStateAction<string>>;
  value?: string;
}

export const CodeInput = ({ isPending, onChange, value }: Props) => {
  return (
    <div className="relative flex items-center gap-1">
      <InputOTP
        disabled={isPending}
        maxLength={6}
        onChange={onChange}
        pattern={REGEXP_ONLY_DIGITS}
        value={value}
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
      {isPending && <Loader className="absolute -right-12" />}
    </div>
  );
};
