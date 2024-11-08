'use client';

import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import { Stock } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PortfolioWithStockIds } from '../portfolio/types/portfolio';
import { addOrders as addOrdersFn } from './actions/add-orders';
import { PriceInfoPopover } from './price-info-popover';

interface Props {
  portfolio: PortfolioWithStockIds;
}

type SearchResult = Pick<Stock, 'id' | 'symbol' | 'companyName' | 'image'>;

interface SelectedStock {
  stock: SearchResult;
  date: string;
  price?: number;
  quantity: number;
}

export const AddModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedStock[]>([]);

  const router = useRouter();
  const { data, isFetched, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
    staleTime: 500,
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 300),
    [refetch],
  );

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to add stocks to portfolio.'),
    onSuccess: ({ error }) => {
      if (error) {
        return toast.error('Failed to add stocks to portfolio.');
      }
      router.refresh();
    },
  });

  const onSubmit = () => {
    if (selected.length === 0) {
      return toast.info('Please select at least one stock.');
    } else if (selected.length > 50) {
      return toast.warning(`You can only add ${50} stocks at a time.`);
    }

    const orders = selected.map((entry) => ({
      stockId: entry.stock.id,
      type: 'BUY',
      ...entry,
      stock: undefined,
    }));

    addOrders({ portfolioId: portfolio.id, orders });
    setSelected([]);
    setOpen(false);
  };

  const addToSelected = (stock: SearchResult) => {
    if (!selected.some((s) => s.stock.id === stock.id)) {
      setSelected([
        ...selected,
        {
          stock,
          date: new Date().toISOString(),
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromSelected = (stock: SearchResult) => {
    setSelected(selected.filter((s) => s.stock.id !== stock.id));
  };

  const updateStockDetails = (
    stockId: string,
    field: keyof Omit<SelectedStock, 'stock'>,
    value?: number | string,
  ) => {
    setSelected(
      selected.map((s) =>
        s.stock.id === stockId ? { ...s, [field]: value } : s,
      ),
    );
  };

  const onOpenChange = (value: boolean) => {
    if (value === false) {
      router.refresh();
    }
    setOpen(value);
    setInput('');
    setSelected([]);
  };

  return (
    <>
      <Button
        aria-label="Add orders"
        size="icon"
        variant="faded"
        onClick={() => setOpen(true)}
      >
        <Plus size={18} />
      </Button>

      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput
          onValueChange={(text) => {
            setInput(text);
            void debounceRequest();
          }}
          value={input}
          placeholder="Search stocks..."
        />

        <CommandList key={data?.length}>
          {input.length > 0 ? (
            <>
              {isFetched ? (
                data?.length ? (
                  <CommandGroup heading="Stocks" className="gap-1">
                    {data
                      .filter((stock) => !stock.isEtf)
                      .map((stock) => {
                        const isSelected = selected.some(
                          (s) => s.stock.id === stock.id,
                        );

                        return (
                          <CommandItem
                            key={stock.id}
                            onSelect={() => addToSelected(stock)}
                            value={stock.symbol + stock.companyName}
                            className="f-col relative cursor-pointer items-start"
                          >
                            <div className="flex items-start gap-2">
                              <SymbolItem stock={stock} />
                              {isSelected && (
                                <Badge
                                  className="mt-[1px] h-5 transition-colors hover:bg-destructive hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromSelected(stock);
                                  }}
                                >
                                  Remove
                                </Badge>
                              )}
                            </div>
                            {isSelected && (
                              <div className="f-center gap-2 px-1 pt-2">
                                <div className="f-col gap-0.5">
                                  <Label className="p-0.5">Date</Label>
                                  <Popover modal={true}>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          'w-[200px] pl-3',
                                          !selected.find(
                                            (s) => s.stock.id === stock.id,
                                          )?.date && 'text-muted-foreground',
                                        )}
                                      >
                                        {selected.find(
                                          (s) => s.stock.id === stock.id,
                                        )?.date ? (
                                          format(
                                            new Date(
                                              selected.find(
                                                (s) => s.stock.id === stock.id,
                                              )!.date,
                                            ),
                                            'PPP',
                                          )
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={
                                          new Date(
                                            selected.find(
                                              (s) => s.stock.id === stock.id,
                                            )!.date,
                                          )
                                        }
                                        onSelect={(date) => {
                                          updateStockDetails(
                                            stock.id,
                                            'date',
                                            date?.toISOString(),
                                          );
                                        }}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div>
                                  <PriceInfoPopover className="p-0.5" />
                                  <Input
                                    type="number"
                                    className="w-32"
                                    placeholder="Custom Price"
                                    onChange={(e) =>
                                      updateStockDetails(
                                        stock.id,
                                        'price',
                                        Number.parseFloat(e.target.value) ?? 1,
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Quantity</Label>
                                  <Input
                                    type="number"
                                    className="w-24"
                                    defaultValue={1}
                                    onChange={(e) =>
                                      updateStockDetails(
                                        stock.id,
                                        'quantity',
                                        Number.parseFloat(e.target.value),
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                ) : (
                  <CommandEmpty className="f-box h-[300px]">
                    <p className="text-sm text-gray-400">
                      No search results found.
                    </p>
                  </CommandEmpty>
                )
              ) : (
                <CommandEmpty className="f-box h-[300px]">
                  <Loader />
                </CommandEmpty>
              )}
            </>
          ) : (
            <CommandEmpty className="f-box h-[300px]">
              <p className="text-sm text-gray-400">
                Search results will appear here.
              </p>
            </CommandEmpty>
          )}
        </CommandList>
        <div className="flex justify-between border-t p-2 px-3">
          <div className="f-center gap-1">
            {selected?.length ? (
              <div className="f-center gap-3">
                {selected
                  .slice(0, Math.min(4, selected.length))
                  .map(({ stock }) => (
                    <div className="relative" key={stock.id}>
                      <button
                        className="f-box absolute -right-1.5 -top-0.5 h-4 w-4 rounded-full bg-destructive text-white transition-colors hover:bg-red-600"
                        onClick={() => removeFromSelected(stock)}
                        aria-label="Remove stock"
                      >
                        <X size={12} />
                      </button>
                      <Badge>{stock.symbol}</Badge>
                    </div>
                  ))}
                {selected.length > 4 && (
                  <div className="relative">
                    <Badge>...+{selected.length - 4}</Badge>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Stocks you select will appear here.
              </p>
            )}
          </div>

          <Button className="h-8" isLoading={isPending} onClick={onSubmit}>
            Add
          </Button>
        </div>
      </CommandDialog>
    </>
  );
};
