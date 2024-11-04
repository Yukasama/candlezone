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
    const params = new URLSearchParams(searchParams.toString());

    modifyParam(params, filterId as string, newValue, 'Any');
    params.set('cursor', '1');
    router.replace(`/screener?${params.toString()}`);
  };

  const updateNumFilter = useMemo(
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
          modifyParam(params, `${filterId}Min`, minValue, defaultMin);
          modifyParam(params, `${filterId}Max`, maxValue, defaultMax);

          params.set('cursor', '1');
          router.replace(`/screener?${params.toString()}`);
        },
        300,
      ),
    [searchParams, router],
  );

  useEffect(() => {
    return () => updateNumFilter.cancel();
  }, [updateNumFilter]);

  useEffect(() => {
    if (!searchParams.toString()) {
      setSliderValues({});
    }
  }, [searchParams]);

  const updateSlider = (
    filterId: string,
    values: [number, number],
    defaultMin: number,
    defaultMax: number,
  ) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [filterId]: values,
    }));
    updateNumFilter(filterId, ...values, defaultMin, defaultMax);
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
            {descriptive.map((filter) => (
              <Select
                key={filter.id}
                value={filter.value}
                defaultValue={`${filter.label} (Any)`}
                onValueChange={(value) =>
                  updateFilter(filter.id as keyof ScreenerProps, value)
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={`${filter.label} (Any)`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={`${filter.label} (Any)`}
                  >{`${filter.label} (Any)`}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fundamental">
          <AccordionTrigger>Fundamental Filters</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-3">
            {fundamental.map((filter) => (
              <div key={filter.id} className="space-y-1.5 p-2 px-2.5">
                <RangeSlider
                  label={(value) =>
                    `${value?.toString()}${filter.label.includes('%') ? '%' : ''}`
                  }
                  value={
                    sliderValues[filter.id] ?? [
                      filter.value?.at(0) ?? filter.min,
                      filter.value?.at(1) ?? filter.max,
                    ]
                  }
                  onValueChange={(values) =>
                    updateSlider(
                      filter.id,
                      values as [number, number],
                      filter.min,
                      filter.max,
                    )
                  }
                  min={filter.min}
                  max={filter.max}
                  step={(filter.max - filter.min) / 20}
                />
                <p className="text-[13px] text-gray-400">{filter.label}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="technical">
          <AccordionTrigger>Technical Filters</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-3">
            {technical.map((filter) => (
              <div key={filter.id} className="space-y-1.5 p-2 px-2.5">
                <RangeSlider
                  label={(value) =>
                    `${value?.toString()}${filter.label.includes('%') ? '%' : ''}`
                  }
                  value={
                    sliderValues[filter.id] ?? [
                      filter.value?.at(0) ?? filter.min,
                      filter.value?.at(1) ?? filter.max,
                    ]
                  }
                  onValueChange={(values) =>
                    updateSlider(
                      filter.id,
                      values as [number, number],
                      filter.min,
                      filter.max,
                    )
                  }
                  min={filter.min}
                  max={filter.max}
                  step={(filter.max - filter.min) / 20}
                />
                <p className="text-[13px] text-gray-400">{filter.label}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
