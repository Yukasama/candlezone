'use';

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
import { useState, type HTMLAttributes } from 'react';
import type { FieldValues } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: FieldValues;
  isPending?: boolean;
  isConfirm?: boolean;
  isLogin?: boolean;
}

export const PasswordInput = ({
  field,
  className,
  isPending,
  isConfirm,
  isLogin,
}: Readonly<Props>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem className={cn('relative', className)}>
      <FormLabel>{isConfirm ? 'Confirm Password' : 'Password'}</FormLabel>
      <FormControl>
        <div className="relative flex items-center">
          <Input
            type={showPassword ? 'text' : 'password'}
            disabled={isPending}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder={
              isConfirm ? 'Confirm your Password' : 'Enter your Password'
            }
            {...field}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            tabIndex={-1}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="absolute right-2 inline-flex items-center"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
