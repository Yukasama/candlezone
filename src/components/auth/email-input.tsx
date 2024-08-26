import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import type { FieldValues } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: FieldValues;
  isPending?: boolean;
}

export const EmailInput = ({
  field,
  className,
  isPending,
}: Readonly<Props>) => {
  return (
    <FormItem className={cn(className)}>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input
          type="email"
          disabled={isPending}
          placeholder="john.doe@gmail.com"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
