'use client';

import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: Pick<
    ControllerRenderProps<{ quantity: number }, 'quantity'>,
    'value' | 'onChange'
  >;
  isPending: boolean;
}

export const QuantityField = ({ field, isPending }: Props) => {
  return (
    <div className="f-center gap-1.5">
      <Button
        onClick={() => {
          if (field.value > 1) {
            field.onChange(field.value - 1);
          }
        }}
        size="small-icon"
        disabled={field.value === 1 || isPending}
        type="button"
      >
        <ArrowDown className="size-4" />
      </Button>
      <FormControl>
        <Input
          type="number"
          className="w-40 rounded-none border-x-0 border-t-0 text-center text-xl"
          disabled={isPending}
          {...field}
        />
      </FormControl>
      <Button
        onClick={() => {
          field.onChange(field.value + 1);
        }}
        size="small-icon"
        disabled={isPending}
        type="button"
      >
        <ArrowUp className="size-4" />
      </Button>
    </div>
  );
};
