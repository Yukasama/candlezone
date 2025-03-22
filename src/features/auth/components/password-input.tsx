'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { type HTMLAttributes, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  error?: string;
  field: FieldValues;
  isConfirm?: boolean;
  isLogin?: boolean;
  isPending?: boolean;
}

export const PasswordInput = ({
  className,
  error,
  field,
  isConfirm,
  isLogin,
  isPending,
}: Readonly<Props>) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordPlaceholder = isLogin ? '**********' : 'Enter your Password';

  return (
    <FormItem className={cn('relative', className)}>
      <FormLabel>{isConfirm ? 'Confirm Password' : 'Password'}</FormLabel>
      <FormControl>
        <div className="relative flex items-center">
          <Input
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            disabled={isPending}
            placeholder={
              isConfirm ? 'Confirm your Password' : passwordPlaceholder
            }
            type={showPassword ? 'text' : 'password'}
            {...field}
          />
          <Button
            className="absolute right-2 inline-flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            size="icon"
            tabIndex={-1}
            type="button"
            variant="ghost"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
        </div>
      </FormControl>
      <FormMessage>{error}</FormMessage>
    </FormItem>
  );
};
