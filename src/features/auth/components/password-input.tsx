import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import type { FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: FieldValues;
  isPending?: boolean;
  isConfirm?: boolean;
}

export const PasswordInput = ({
  field,
  className,
  isPending,
  isConfirm,
}: Readonly<Props>) => {
  return (
    <FormItem className={cn(className)}>
      <FormLabel>{isConfirm ? 'Confirm Password' : 'Password'}</FormLabel>
      <FormControl>
        <Input
          type="password"
          disabled={isPending}
          placeholder={
            isConfirm ? 'Confirm your Password' : 'Enter your Password'
          }
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
