'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: Pick<
    ControllerRenderProps<{ quantity: number }, 'quantity'>,
    'onChange' | 'value'
  >;
  isPending: boolean;
}

export const QuantityField = ({ field, isPending }: Props) => {
  return (
    <FormItem>
      <FormLabel>Quantity</FormLabel>
      <div className="flex items-center gap-1.5">
        <Button
          disabled={field.value === 1 || isPending}
          onClick={() => {
            if (field.value > 1) {
              field.onChange(field.value - 1);
            }
          }}
          size="small-icon"
          type="button"
        >
          <ArrowDown className="size-4" />
        </Button>
        <FormControl>
          <Input
            className="w-40 rounded-none border-x-0 border-t-0 text-center text-xl"
            disabled={isPending}
            type="number"
            {...field}
          />
        </FormControl>
        <Button
          disabled={isPending}
          onClick={() => field.onChange(field.value + 1)}
          size="small-icon"
          type="button"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};
