'use client';

import { DialogButtons } from '@/components/dialog-buttons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  OrderPropsWithoutId,
  OrderSchemaWithoutId,
} from '@/features/order/lib/validators';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { StockQuote } from '@/features/stock/types/stock';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, ChevronDown, RefreshCcw } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { addOrders as addOrdersFn } from './actions/add-orders';
import { PriceField } from './components/price-field';
import { QuantityField } from './components/quantity-field';

interface Props {
  stock: StockQuote;
  portfolios?: PortfolioWithQuotes[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const NewOrderForm = ({
  stock,
  portfolios = [],
  setOpen,
}: Readonly<Props>) => {
  const [portfolioId, setPortfolioId] = useState<string | undefined>(
    portfolios.length > 0 ? portfolios[0].id : undefined,
  );

  const selectedPortfolio = useMemo(() => {
    return portfolios.find((portfolio) => portfolio.id === portfolioId);
  }, [portfolioId, portfolios]);

  const availableQuantity = useMemo(() => {
    if (!selectedPortfolio) {
      return;
    }

    let summedQuantity = 0;
    for (const { stockId, quantity } of selectedPortfolio.orders) {
      if (stockId === stock.id) {
        summedQuantity += quantity ?? 0;
      }
    }
    return summedQuantity;
  }, [selectedPortfolio, stock.id]);

  const { data, refetch, isFetching } = useQuery({
    queryFn: async () => await getQuote({ symbol: stock.symbol }),
    queryKey: ['quote', stock.symbol],
  });

  const form = useForm<OrderPropsWithoutId>({
    resolver: zodResolver(OrderSchemaWithoutId),
    defaultValues: {
      stockId: stock.id,
      date: new Date().toISOString(),
      type: 'BUY',
      quantity: 1,
      price: 0,
    },
  });

  useEffect(() => {
    if (data?.price) {
      form.setValue('price', data.price, { shouldValidate: true });
    }
  }, [form, data?.price]);

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to create order.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
        return;
      }
      setOpen(false);
      toast.success('Order created successfully.');
    },
  });

  const onSubmit = (values: OrderPropsWithoutId) => {
    if (!portfolioId) {
      toast.error('Please select a portfolio.');
      return;
    }

    addOrders({
      portfolioId,
      orders: [{ ...values, stockId: stock.id }],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="f-center h-10 gap-3">
            <p className="w-24 text-[13px] text-gray-400">Symbol</p>
            <SymbolItem stock={stock} fullLength className="mr-1.5" size="sm" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger disabled={portfolios.length === 1}>
              <div className="f-center h-10 gap-3">
                <p className="w-[100px] text-start text-[13px] text-gray-400">
                  Portfolio
                </p>
                {portfolios.length === 0 ? (
                  <Badge className="mt-[1px]">No portfolios</Badge>
                ) : (
                  <Badge
                    className="text-white"
                    style={{
                      backgroundColor: selectedPortfolio?.color ?? '#000',
                    }}
                  >
                    {selectedPortfolio?.title ?? 'Select Portfolio'}
                    {portfolios.length > 1 && (
                      <ChevronDown className="ml-1 size-4" />
                    )}
                  </Badge>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="translate-x-4">
              {portfolios.map((portfolio) => (
                <DropdownMenuItem
                  key={portfolio.id}
                  onClick={() => {
                    setPortfolioId(portfolio.id);
                  }}
                >
                  <p className="w-32">{portfolio.title}</p>
                  {portfolio.id === portfolioId && (
                    <Check className="ml-3 size-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <div className="f-center h-10 gap-3">
                <p className="w-18 text-[13px] text-gray-400">Order made on</p>
                <DatePicker field={field} />
              </div>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-1">
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
          <p className="text-sm text-gray-400">
            Available shares: {availableQuantity}
          </p>
        </div>

        <div className="f-col gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <div className="f-center gap-2">
                  <Button
                    disabled={isPending}
                    size="sm"
                    type="button"
                    variant={field.value === 'BUY' ? 'success' : 'secondary'}
                    onClick={() => {
                      field.onChange('BUY');
                    }}
                  >
                    BUY
                  </Button>
                  <Button
                    disabled={
                      isPending ||
                      (availableQuantity ?? 0) < form.getValues('quantity')
                    }
                    size="sm"
                    type="button"
                    variant={
                      field.value === 'SELL' ? 'destructive' : 'secondary'
                    }
                    onClick={() => {
                      field.onChange('SELL');
                    }}
                  >
                    SELL
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </div>

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
                  onClick={() => refetch()}
                  type="button"
                >
                  <RefreshCcw className="size-3.5" />
                </Button>
              </div>
              <PriceField
                field={field}
                isPending={isPending}
                isFetching={isFetching}
                range={stock.range ?? undefined}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogButtons
          isPending={isPending}
          setOpen={setOpen}
          buttonText="Submit"
          buttonLoadingText="Submitting"
          buttonDisabled={!portfolioId}
        />
      </form>
    </Form>
  );
};
