import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import type { FieldValues } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: FieldValues;
  isPending?: boolean;
}

export const EmailInput = ({
  className,
  field,
  isPending,
}: Readonly<Props>) => {
  return (
    <FormItem className={cn(className)}>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input
          disabled={isPending}
          placeholder="john.doe@gmail.com"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
