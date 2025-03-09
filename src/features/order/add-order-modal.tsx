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
import { StockCard } from '@/features/stock/components/stock-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';
import { Check, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SearchbarInput } from '../../components/searchbar-input';
import { SearchbarResults } from '../../components/searchbar-results';
import { getRecentStocks } from '../stock/actions/get-recent-stocks';
import { StockSearch } from '../stock/types/stock';
import { addOrders as addOrdersFn } from './actions/add-orders';
import { PriceField } from './components/price-field';
import { QuantityField } from './components/quantity-field';
import { OrderPropsWithoutId, OrderSchemaWithoutId } from './lib/validators';

interface Props {
  portfolio?: Exclude<Awaited<ReturnType<typeof getFullPortfolio>>, undefined>;
}

export const AddOrderModal = ({ portfolio }: Readonly<Props>) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'search' | 'success'>('search');
  const [searchInput, setSearchInput] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<OrderPropsWithoutId>();
  const [selectedStock, setSelectedStock] = useState<StockSearch>();

  const form = useForm<OrderPropsWithoutId>({
    defaultValues: {
      date: new Date().toISOString(),
      price: 0,
      quantity: 1,
      stockId: selectedStock?.id,
      type: 'BUY',
    },
    resolver: zodResolver(OrderSchemaWithoutId),
  });

  const { data: recentStocks } = useQuery({
    queryFn: async () => await getRecentStocks({ take: 7, withDefaults: true }),
    queryKey: ['recent-stocks'],
    staleTime: 10000,
  });

  const { data, isFetching, refetch } = useQuery({
    enabled: false,
    queryFn: async () => await searchStocks({ input: searchInput }),
    queryKey: ['search-stocks', searchInput],
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 150),
    [refetch],
  );

  const { isPending, mutate: addOrders } = useMutation({
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
      orders: [
        {
          ...values,
          stockId: selectedStock.id,
          type: 'BUY',
        },
      ],
      portfolioId: portfolio.id,
    });

    setStep('success');
    setSubmittedOrder(values);
  };

  return (
    <>
      <CustomTooltip content="Add stocks to your portfolio" side="bottom">
        <Button
          aria-label="Add new order"
          onClick={() => setOpen(true)}
          size="icon"
          variant="faded"
        >
          <Plus size={18} />
        </Button>
      </CustomTooltip>

      <ResponsiveDialog open={open} setOpen={setOpen} title="Add Order">
        {step === 'search' && (
          <div className="space-y-3">
            <SearchbarInput
              debounceRequest={debounceRequest}
              open={open}
              searchInput={searchInput}
              setInput={setSearchInput}
            />

            <SearchbarResults
              data={data}
              input={searchInput}
              isFetching={isFetching}
              onClick={handleSelectStock}
              recentStocks={recentStocks}
            />

            <Button
              className="ml-auto hidden md:block"
              onClick={handleCancel}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        )}

        {step === 'details' && selectedStock && (
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <div className="flex h-10 items-center gap-3">
                  <p className="text-desc w-24 text-[13px]">Symbol</p>
                  <StockCard stock={selectedStock} />
                  <Button
                    onClick={() => setStep('search')}
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
                      <p className="text-desc w-[90px] text-[13px]">
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
                    range={selectedStock.range ?? undefined}
                    symbol={selectedStock.symbol}
                  />
                )}
              />

              <DialogButtons
                buttonLoadingText="Submitting"
                buttonText="Submit"
                isPending={isPending}
                setOpen={setOpen}
              />
            </form>
          </Form>
        )}

        {step === 'success' && selectedStock && submittedOrder && (
          <div className="space-y-4">
            <div className="from-success/5 to-success/5 flex items-center justify-between rounded-lg border bg-gradient-to-r p-4 shadow-sm">
              <div>
                <strong className="text-success text-lg font-medium">
                  Order successful!
                </strong>
                <p className="text-muted-foreground text-sm">
                  Your order has been added to your portfolio
                </p>
              </div>
              <div className="animate-in fade-in zoom-in bg-success/10 flex size-10 items-center justify-center rounded-full p-2 duration-300">
                <Check className="text-success size-5" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="mb-4 flex items-center">
                <StockCard stock={selectedStock} />
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
                className="hidden md:block"
                onClick={() => {
                  setOpen(false);
                  setStep('search');
                  setSelectedStock(undefined);
                  setSubmittedOrder(undefined);
                  form.reset();
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                className="w-full md:w-fit"
                onClick={() => {
                  setStep('search');
                  setSelectedStock(undefined);
                  setSubmittedOrder(undefined);
                  form.reset();
                }}
              >
                Back to search
              </Button>
            </div>
          </div>
        )}
      </ResponsiveDialog>
    </>
  );
};
