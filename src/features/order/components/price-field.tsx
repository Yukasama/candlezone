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
  field: Pick<
    ControllerRenderProps<{ price?: number }, 'price'>,
    'value' | 'onChange'
  >;
  isPending: boolean;
  fetchDisabled?: boolean;
  symbol?: string;
  range?: string;
}

export const PriceField = ({
  field,
  isPending,
  fetchDisabled,
  symbol,
  range,
}: Props) => {
  const [minPrice, maxPrice] = (range ?? '0-0')
    .split('-')
    .map((val) => Number.parseFloat(Number.parseFloat(val).toFixed(2)));

  const { data, refetch, isFetching } = useQuery({
    queryFn: async () => symbol && (await getQuote({ symbol })),
    queryKey: ['quote', symbol],
    enabled: !fetchDisabled && !!symbol,
  });

  useEffect(() => {
    if (
      data &&
      data.price &&
      (field.value === undefined || field.value === 0)
    ) {
      field.onChange(data.price);
    }
  }, [data, field, field.value, field.onChange, isFetching]);

  return (
    <FormItem>
      <div className="flex items-center gap-1">
        <FormLabel>Price</FormLabel>
        <Button
          size="small-icon"
          type="button"
          variant="ghost"
          onClick={() => refetch()}
        >
          <RefreshCcw className="size-3.5" />
        </Button>
      </div>

      {range && (
        <div className="flex gap-1.5 text-sm text-gray-400">
          {minPrice}
          <Slider
            className="w-40"
            min={minPrice}
            max={maxPrice}
            value={[field.value ?? minPrice]}
            disabled={isPending}
            onValueChange={(sliderValueArray) => {
              field.onChange(Number(sliderValueArray[0].toFixed(2)));
            }}
            step={0.01}
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
              type="number"
              className="w-40 rounded-none border-x-0 border-t-0 text-center text-lg"
              disabled={isPending}
              value={field.value ?? ''}
              onChange={(e) => {
                field.onChange(Number(e.target.value));
              }}
            />
          )}
          <p className="text-gray-400">USD</p>
        </div>
      </FormControl>
    </FormItem>
  );
};
