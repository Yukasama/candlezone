'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { getFullPortfolio } from '@/features/portfolio/lib/queries';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';
import { Check, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
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
  const [step, setStep] = useState<'search' | 'details' | 'success'>('search');
  const [searchInput, setSearchInput] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<OrderPropsWithoutId>();
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

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to add stock to portfolio.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
      }
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

    setStep('success');
    setSubmittedOrder(values);
  };

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
                <div className="flex h-10 items-center gap-3">
                  <p className="w-24 text-[13px] text-gray-400">Symbol</p>
                  <SymbolItem
                    fullLength
                    stock={selectedStock}
                    size="sm"
                    className="mr-1"
                  />
                  <Button
                    onClick={() => {
                      setStep('search');
                    }}
                    size="icon-sm"
                    variant="faded"
                  >
                    Change
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <div className="flex h-10 items-center gap-3">
                      <p className="w-[90px] text-[13px] text-gray-400">
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
                  <QuantityField field={field} isPending={isPending} />
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <PriceField
                    field={field}
                    isPending={isPending}
                    symbol={selectedStock.symbol}
                    range={selectedStock.range ?? undefined}
                  />
                )}
              />

              <DialogButtons
                isPending={isPending}
                setOpen={setOpen}
                buttonText="Submit"
                buttonLoadingText="Submitting"
              />
            </form>
          </Form>
        )}

        {step === 'success' && selectedStock && submittedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-green-50/5 to-green-100/5 p-4 shadow-sm">
              <div>
                <h3 className="text-lg font-medium text-green-600 dark:text-green-400">
                  Order successful!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your order has been added to your portfolio
                </p>
              </div>
              <div className="animate-in fade-in zoom-in flex size-10 items-center justify-center rounded-full bg-green-500/10 p-2 duration-300">
                <Check className="size-5 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="mb-4 flex items-center">
                <SymbolItem fullLength stock={selectedStock} />
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-center">
                  <p className="text-muted-foreground w-60">Date</p>
                  <p className="text-md font-medium">
                    {format(submittedOrder.date, 'PPP')}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-muted-foreground w-60">Price</p>
                  <p className="text-md font-medium">${submittedOrder.price}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-muted-foreground w-60">Quantity</p>
                  <p className="text-md font-medium">
                    {submittedOrder.quantity}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-muted-foreground w-60">Total Value</p>
                  <p className="text-md font-medium">
                    $
                    {(
                      submittedOrder.quantity * (submittedOrder.price ?? 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={() => {
                  setOpen(false);
                  setStep('search');
                  setSelectedStock(undefined);
                  setSubmittedOrder(undefined);
                  form.reset();
                }}
                variant="secondary"
                className="hidden md:block"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setStep('search');
                  setSelectedStock(undefined);
                  setSubmittedOrder(undefined);
                  form.reset();
                }}
                className="w-full md:w-fit"
              >
                Back to search
              </Button>
            </div>
          </div>
        )}
      </ResponsiveDialog>
    </>
  );
}
