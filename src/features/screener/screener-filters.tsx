'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { RangeSlider } from '@/components/ui/range-slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScreenerProps } from '@/features/screener/lib/validators';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import { getFilters, getFiltersFromSearchParams } from './config/filters';

const setOrDeleteParam = (
  params: URLSearchParams,
  paramName: string,
  value: string | number | undefined,
  defaultValue: string | number | undefined,
) => {
  if (value === defaultValue || value === undefined || value === 'Any') {
    params.delete(paramName);
  } else {
    params.set(paramName, value.toString());
  }
};

export const ScreenerFilters = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = getFiltersFromSearchParams(searchParams);
  const screenerFilters = getFilters(filters);

  const [localSliderValues, setLocalSliderValues] = useState<
    Record<string, [number, number]>
  >({});

  const updateSelectFilter = (
    filterId: keyof ScreenerProps,
    newValue: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    setOrDeleteParam(params, filterId as string, newValue, 'Any');
    params.set('cursor', '1');
    router.replace(`/screener?${params.toString()}`);
  };

  const debouncedUpdateNumericFilter = useMemo(
    () =>
      debounce(
        (
          filterId: string,
          minValue: number,
          maxValue: number,
          defaultMin: number,
          defaultMax: number,
        ) => {
          const params = new URLSearchParams(searchParams.toString());
          setOrDeleteParam(params, `${filterId}Min`, minValue, defaultMin);
          setOrDeleteParam(params, `${filterId}Max`, maxValue, defaultMax);

          params.set('cursor', '1');
          router.replace(`/screener?${params.toString()}`);
        },
        300,
      ),
    [searchParams, router],
  );

  useEffect(() => {
    return () => debouncedUpdateNumericFilter.cancel();
  }, [debouncedUpdateNumericFilter]);

  const handleSliderChange = (
    filterId: string,
    values: [number, number],
    defaultMin: number,
    defaultMax: number,
  ) => {
    setLocalSliderValues((prevValues) => ({
      ...prevValues,
      [filterId]: values,
    }));
    debouncedUpdateNumericFilter(filterId, ...values, defaultMin, defaultMax);
  };

  return (
    <Card className={cn('rounded-none', className)}>
      <Accordion
        type="multiple"
        defaultValue={screenerFilters.map((filter) => filter.id)}
      >
        {screenerFilters.map((entry) => (
          <AccordionItem key={entry.id} value={entry.id}>
            <AccordionTrigger className="pt-2 text-left">
              {entry.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2.5">
                {entry.filters.map((filter) => {
                  const isSelect = filter.selector === 'select';
                  return isSelect ? (
                    <Select
                      key={filter.id}
                      value={filter.value}
                      onValueChange={(value) =>
                        updateSelectFilter(
                          filter.id as keyof ScreenerProps,
                          value,
                        )
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={`${filter.label} (Any)`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">{`${filter.label} (Any)`}</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div key={filter.id} className="space-y-1.5 p-2 pt-5">
                      <RangeSlider
                        label={(value) => value?.toString()}
                        value={
                          localSliderValues[filter.id] ?? [
                            filter.value?.[0] ?? filter.min,
                            filter.value?.[1] ?? filter.max,
                          ]
                        }
                        onValueChange={(values) =>
                          handleSliderChange(
                            filter.id,
                            values as [number, number],
                            filter.min,
                            filter.max,
                          )
                        }
                        min={filter.min}
                        max={filter.max}
                        step={(filter.max - filter.min) / 10}
                      />
                      <p className="text-gray-400">{filter.label}</p>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};
