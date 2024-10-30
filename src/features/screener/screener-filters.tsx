'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScreenerProps } from '@/features/screener/lib/validators';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import type { HTMLAttributes } from 'react';
import { getFilters, getFiltersFromSearchParams } from './config/filters';

export const ScreenerFilters = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = getFiltersFromSearchParams(searchParams);
  const screenerFilters = getFilters(filters);

  const updateFilter = (filterId: keyof ScreenerProps, newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue === 'Any') {
      params.delete(filterId as string);
    } else {
      params.set(filterId as string, newValue);
    }

    params.set('cursor', '1');
    router.replace(`/screener?${params.toString()}`);
  };

  return (
    <Card className={cn('f-col rounded-none', className)}>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={screenerFilters.map((filter) => filter.id)}
      >
        {screenerFilters.map((entry) => (
          <AccordionItem key={entry.id} value={entry.id}>
            <AccordionTrigger className="pt-2 text-left">
              {entry.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="f-col gap-2.5">
                {entry.filters.map((filter) => (
                  <div key={filter.id}>
                    <Select
                      value={filter.value}
                      onValueChange={(value) =>
                        updateFilter(filter.id as keyof ScreenerProps, value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={filter.label + ' (Any)'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">
                          {filter.label + ' (Any)'}
                        </SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};
