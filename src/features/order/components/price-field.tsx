'use client';

import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { useEffect, type HTMLAttributes } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  field: Pick<
    ControllerRenderProps<{ price?: number }, 'price'>,
    'value' | 'onChange'
  >;
  isPending: boolean;
  isFetching: boolean;
  range?: string;
}

export const PriceField = ({ field, isPending, isFetching, range }: Props) => {
  const [minPrice, maxPrice] = (range ?? '0-0')
    .split('-')
    .map((price) => Number.parseFloat(Number.parseFloat(price).toFixed(2)));

  useEffect(() => {
    field.onChange(field.value);
  }, [isFetching, field, field.value]);

  return (
    <>
      {range && (
        <div className="flex gap-1.5">
          <p className="text-sm text-gray-400">{minPrice}</p>
          <Slider
            className="w-40"
            min={minPrice}
            max={maxPrice}
            defaultValue={[field.value ?? minPrice]}
            disabled={isPending}
            onValueChange={(value) => {
              field.onChange(Number(value[0].toFixed(2)));
            }}
            step={(maxPrice / minPrice - 1) / 100}
          />
          <p className="text-sm text-gray-400">{maxPrice}</p>
        </div>
      )}
      <FormControl>
        <div className="flex items-end gap-1">
          {isFetching ? (
            <Skeleton className="h-10 w-40 rounded-md" />
          ) : (
            <Input
              type="number"
              className="w-40 rounded-none border-x-0 border-t-0 text-center text-lg"
              disabled={isPending}
              {...field}
            />
          )}
          <p className="text-gray-400">USD</p>
        </div>
      </FormControl>
    </>
  );
};
