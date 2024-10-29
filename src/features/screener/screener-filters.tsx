'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { env } from '@/env.mjs';
import { ScreenerProps } from '@/features/screener/lib/validators';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { Copy, CopyCheck, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { HTMLAttributes } from 'react';
import { getFilters, getFiltersFromSearchParams } from './config/filters';

export const ScreenerFilters = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCopied, copyToClipboard } = useCopyToClipboard({});

  const filters = getFiltersFromSearchParams(searchParams);
  const screenerFilters = getFilters(filters);

  const currentUrl =
    env.NEXT_PUBLIC_HOST_URL +
    `/screener?${new URLSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      cursor: (filters.cursor ?? 1).toString(),
      take: (filters.take ?? 10).toString(),
    }).toString()}`;

  const resetFilters = () => {
    router.replace('/screener');
  };

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
    <Card className={cn('h-screen gap-3 rounded-none', className)}>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={screenerFilters.map((filter) => filter.id)}
      >
        {screenerFilters.map((entry) => (
          <AccordionItem key={entry.id} value={entry.id}>
            <AccordionTrigger className="text-left">
              {entry.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-3">
                {entry.filters.map((filter) => (
                  <div
                    className={cn('f-col', filter.colspan && 'col-span-2')}
                    key={filter.id}
                  >
                    <Label className="text-xs text-gray-400">
                      {filter.label}
                    </Label>
                    <Select
                      value={filter.value}
                      onValueChange={(value) =>
                        updateFilter(filter.id as keyof ScreenerProps, value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
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
      <Button size="sm" onClick={() => copyToClipboard(currentUrl)}>
        {isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
        Copy Selection to Clipboard
      </Button>
      <Button size="sm" variant="destructive" onClick={resetFilters}>
        <RotateCcw size={18} />
        Reset Filters
      </Button>
    </Card>
  );
};
