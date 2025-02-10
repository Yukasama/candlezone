'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { theDayTrader } from '@/features/backtracker/actions/the-day-trader';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

const CURRENCIES = ['EURUSD', 'JPYUSD'];

export default function BacktrackerPage() {
  const [value, setValue] = useState('');

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['currencies', value],
    queryFn: () =>
      theDayTrader({
        symbol: value,
        timeframe: 'All',
        indicators: [{ name: 'RSI' }],
        options: { allFields: true },
      }),
    enabled: false,
  });

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {value
              ? CURRENCIES.find((currency) => currency === value)
              : 'Select currency...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] p-0">
          {CURRENCIES.map((currency) => (
            <DropdownMenuItem
              key={currency}
              onClick={() => {
                setValue(currency);
              }}
            >
              {currency}
              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  value === currency ? 'opacity-100' : 'opacity-0',
                )}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="gradient"
        isLoading={isLoading}
        onClick={() => refetch()}
      >
        <Sparkles className="size-4" />
        Analyze
      </Button>
      {JSON.stringify(data)}
    </div>
  );
}
