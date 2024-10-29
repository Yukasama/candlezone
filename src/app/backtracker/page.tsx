'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { theDayTrader } from '@/features/stock/actions/the-day-trader';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const CURRENCIES = ['EURUSD', 'JPYUSD'];

export default function BacktrackerPage() {
  const [open, setOpen] = useState(false);
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
    <div className="f-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {value
              ? CURRENCIES.find((currency) => currency === value)
              : 'Select currency...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search currency..." className="h-9" />
            <CommandList className="h-full">
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandGroup>
                {CURRENCIES.map((currency) => (
                  <CommandItem
                    key={currency}
                    value={currency}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    {currency}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === currency ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button variant="mythic" isLoading={isLoading} onClick={() => refetch()}>
        Analyze
      </Button>
      {JSON.stringify(data)}
    </div>
  );
}
