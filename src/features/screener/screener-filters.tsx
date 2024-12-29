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
import { type HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { getFilters, getFiltersFromSearchParams } from './config/filters';
import { modifyParam } from './lib/modify-param';

export const ScreenerFilters = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = getFiltersFromSearchParams(searchParams);
  const { descriptive, fundamental, technical } = getFilters(filters);

  const [sliderValues, setSliderValues] = useState<
    Record<string, [number, number]>
  >({});

  const updateFilter = (filterId: keyof ScreenerProps, newValue: string) => {
    const params = new URLSearchParams(String(searchParams));
    modifyParam(params, filterId as string, newValue, 'Any');
    params.set('cursor', '1');
    router.replace(`/screener?${String(params)}`);
  };

  const updateNumFilter = useMemo(
    () =>
      debounce(
        (id: string, min: number, max: number, dMin: number, dMax: number) => {
          const params = new URLSearchParams(String(searchParams));
          modifyParam(params, `${id}Min`, min, dMin);
          modifyParam(params, `${id}Max`, max, dMax);
          params.set('cursor', '1');
          router.replace(`/screener?${String(params)}`);
        },
        300,
      ),
    [searchParams, router],
  );

  useEffect(() => {
    return () => {
      updateNumFilter.cancel();
    };
  }, [updateNumFilter]);

  useEffect(() => {
    if (!String(searchParams)) {
      setSliderValues({});
    }
  }, [searchParams]);

  const updateSlider = (
    id: string,
    values: [number, number],
    dMin: number,
    dMax: number,
  ) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [id]: values,
    }));
    updateNumFilter(id, ...values, dMin, dMax);
  };

  return (
    <Card className={cn('rounded-none', className)}>
      <Accordion
        type="multiple"
        defaultValue={['descriptive', 'fundamental', 'technical']}
      >
        <AccordionItem value="descriptive">
          <AccordionTrigger>Descriptive Filters</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {descriptive.map(({ id, label, value, options, optionLabels }) => (
              <Select
                key={id}
                value={value ?? 'Any'}
                onValueChange={(selectedValue) => {
                  updateFilter(id as keyof ScreenerProps, selectedValue);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue>
                    {`${label}: ${
                      value && value !== 'Any'
                        ? (optionLabels?.[value] ?? value)
                        : 'Any'
                    }`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {optionLabels ? optionLabels[option] : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fundamental">
          <AccordionTrigger>Fundamental Filters</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            {fundamental.map(({ id, label, value, min, max }) => (
              <div key={id} className="space-y-1.5 p-2 px-2.5">
                <RangeSlider
                  label={(value) =>
                    `${String(value)}${label.includes('%') ? '%' : ''}`
                  }
                  value={sliderValues[id] ?? [value[0] ?? min, value[1] ?? max]}
                  onValueChange={(values) => {
                    updateSlider(id, values as [number, number], min, max);
                  }}
                  min={min}
                  max={max}
                  step={(max - min) / 20}
                />
                <p className="text-[13px] text-gray-400">{label}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="technical">
          <AccordionTrigger>Technical Filters</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-4">
            {technical.map(({ id, label, value, min, max }) => (
              <div key={id} className="space-y-1.5 p-2 px-2.5">
                <RangeSlider
                  label={(value) =>
                    `${String(value)}${label.includes('%') ? '%' : ''}`
                  }
                  value={sliderValues[id] ?? [value[0] ?? min, value[1] ?? max]}
                  onValueChange={(values) => {
                    updateSlider(id, values as [number, number], min, max);
                  }}
                  min={min}
                  max={max}
                  step={(max - min) / 20}
                />
                <p className="text-[13px] text-gray-400">{label}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
