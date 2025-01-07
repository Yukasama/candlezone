'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { getFullPortfolio } from '@/features/portfolio/lib/queries';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Pencil, Plus, RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SearchbarInput } from '../shared/components/searchbar-input';
import { SearchbarResults } from '../shared/components/searchbar-results';
import { getRecentStocks } from '../stock/actions/get-recent-stocks';
import { StockSearch } from '../stock/types/stock';
import { addOrders as addOrdersFn } from './actions/add-orders';
import { PriceField } from './components/price-field';
import { QuantityField } from './components/quantity-field';
import { OrderPropsWithoutId, OrderSchemaWithoutId } from './lib/validators';

interface Props {
  portfolio?: Exclude<Awaited<ReturnType<typeof getFullPortfolio>>, undefined>;
}

export function AddOrderModal({ portfolio }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'search' | 'details'>('search');
  const [searchInput, setSearchInput] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockSearch>();

  const form = useForm<OrderPropsWithoutId>({
    resolver: zodResolver(OrderSchemaWithoutId),
    defaultValues: {
      stockId: selectedStock?.id,
      date: new Date().toISOString(),
      type: 'BUY',
      quantity: 1,
      price: 0,
    },
  });

  const { data: recentStocks } = useQuery({
    queryFn: async () => await getRecentStocks({ withDefaults: true, take: 7 }),
    queryKey: ['recent-stocks'],
    staleTime: 10000,
  });

  const { data, isFetching, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input: searchInput }),
    queryKey: ['search-stocks', searchInput],
    enabled: false,
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 150),
    [refetch],
  );

  const { data: priceData, refetch: priceRefetch } = useQuery({
    queryFn: async () =>
      selectedStock && (await getQuote({ symbol: selectedStock.symbol })),
    queryKey: selectedStock ? ['quote', selectedStock.symbol] : ['quote'],
    enabled: !!selectedStock,
  });

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to add stock to portfolio.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Order added successfully!');
    },
  });

  const handleSelectStock = (stock: StockSearch) => {
    setSelectedStock(stock);
    form.reset();
    form.setValue('stockId', stock.id);
    setStep('details');
  };

  const handleCancel = () => {
    if (step === 'details') {
      setSelectedStock(undefined);
      setStep('search');
    } else {
      setOpen(false);
    }
  };

  const onSubmit = (values: OrderPropsWithoutId) => {
    if (!selectedStock) {
      toast.error('No stock selected.');
      return;
    }
    if (!portfolio) {
      toast.error('No portfolio selected.');
      return;
    }

    addOrders({
      portfolioId: portfolio.id,
      orders: [
        {
          ...values,
          stockId: selectedStock.id,
          type: 'BUY',
        },
      ],
    });

    setStep('search');
    setSelectedStock(undefined);
  };

  useEffect(() => {
    if (priceData?.price) {
      form.setValue('price', priceData.price, { shouldValidate: true });
    }
  }, [form, priceData?.price]);

  return (
    <>
      <CustomTooltip content="Add stocks to your portfolio" side="bottom">
        <Button
          aria-label="Add orders"
          size="icon"
          variant="faded"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Plus size={18} />
        </Button>
      </CustomTooltip>

      <ResponsiveDialog open={open} setOpen={setOpen} title="Add Order">
        {step === 'search' && (
          <div className="space-y-3">
            <SearchbarInput
              open={open}
              debounceRequest={debounceRequest}
              searchInput={searchInput}
              setInput={setSearchInput}
            />

            <SearchbarResults
              data={data}
              recentStocks={recentStocks}
              input={searchInput}
              isFetching={isFetching}
              onClick={handleSelectStock}
            />

            <Button
              variant="secondary"
              className="ml-auto hidden md:block"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        )}

        {step === 'details' && selectedStock && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <div className="f-center h-10 gap-3">
                  <p className="w-[90px] text-[13px] text-gray-400">Symbol</p>
                  <CustomTooltip content="Change stock">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStep('search');
                      }}
                      className="f-center gap-2 px-1.5 pr-3"
                    >
                      <SymbolItem fullLength stock={selectedStock} size="sm" />
                      <Pencil className="ml-2.5 h-4 w-4 opacity-50" />
                    </Button>
                  </CustomTooltip>
                </div>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <div className="f-center h-10 gap-3">
                      <p className="w-18 text-[13px] text-gray-400">
                        Order made on
                      </p>
                      <DatePicker field={field} />
                    </div>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <QuantityField field={field} isPending={isPending} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="f-center gap-1">
                      <FormLabel>Price</FormLabel>
                      <Button
                        size="small-icon"
                        variant="ghost"
                        onClick={() => priceRefetch()}
                        type="button"
                      >
                        <RefreshCcw className="size-3.5" />
                      </Button>
                    </div>
                    <PriceField
                      field={field}
                      isPending={isPending}
                      range={selectedStock.range ?? undefined}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogButtons
                isPending={isPending}
                setOpen={setOpen}
                buttonText="Create"
                buttonLoadingText="Creating"
              />
            </form>
          </Form>
        )}
      </ResponsiveDialog>
    </>
  );
}
