'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { useQuery } from '@tanstack/react-query';
import { RefreshCcw } from 'lucide-react';
import { HTMLAttributes, useEffect } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

interface Props extends HTMLAttributes<HTMLDivElement> {
  fetchDisabled?: boolean;
  field: Pick<
    ControllerRenderProps<{ price?: number }, 'price'>,
    'onChange' | 'value'
  >;
  isPending: boolean;
  range?: string;
  symbol?: string;
}

export const PriceField = ({
  fetchDisabled,
  field,
  isPending,
  range,
  symbol,
}: Props) => {
  const [minPrice, maxPrice] = (range ?? '0-0')
    .split('-')
    .map((val) => Number.parseFloat(Number.parseFloat(val).toFixed(2)));

  const { data, isFetching, refetch } = useQuery({
    enabled: !fetchDisabled && !!symbol,
    queryFn: async () => symbol && (await getQuote({ symbol })),
    queryKey: ['quote', symbol],
  });

  useEffect(() => {
    if (
      data &&
      data.price &&
      (field.value === undefined || field.value === 0 || isFetching)
    ) {
      field.onChange(data.price.toFixed(2));
    }
  }, [data, field, isFetching]);

  return (
    <FormItem>
      <div className="flex items-center gap-1">
        <FormLabel>Price</FormLabel>
        <Button
          aria-label="Refresh price"
          onClick={async () => await refetch()}
          size="small-icon"
          type="button"
          variant="ghost"
        >
          <RefreshCcw className="size-3.5" />
        </Button>
      </div>

      {range && (
        <div className="text-desc flex gap-1.5 text-sm">
          {minPrice}
          <Slider
            className="w-40"
            disabled={isPending}
            max={maxPrice}
            min={minPrice}
            onValueChange={(sliderValueArray) => {
              field.onChange(Number(sliderValueArray[0].toFixed(2)));
            }}
            step={0.01}
            value={[field.value ?? minPrice]}
          />
          {maxPrice}
        </div>
      )}

      <FormControl>
        <div className="flex items-end gap-1">
          {isFetching ? (
            <Skeleton className="h-10 w-40 rounded-md" />
          ) : (
            <Input
              className="w-40 rounded-none border-x-0 border-t-0 text-center text-lg"
              disabled={isPending}
              name="price"
              onChange={(e) => field.onChange(Number(e.target.value))}
              type="number"
              value={field.value ?? ''}
            />
          )}
          <p className="text-desc">USD</p>
        </div>
      </FormControl>
    </FormItem>
  );
};
