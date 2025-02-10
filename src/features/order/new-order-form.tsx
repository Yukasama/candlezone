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
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  OrderPropsWithoutId,
  OrderSchemaWithoutId,
} from '@/features/order/lib/validators';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { StockQuote } from '@/features/stock/types/stock';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Check, ChevronDown } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
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
          <div className="flex h-10 items-center gap-3">
            <p className="text-desc w-24 text-[13px]">Symbol</p>
            <SymbolItem stock={stock} fullLength className="mr-1.5" size="sm" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger disabled={portfolios.length === 1}>
              <div className="flex h-10 items-center gap-3">
                <p className="text-desc w-[100px] text-start text-[13px]">
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
              <div className="flex h-10 items-center gap-3">
                <p className="text-desc w-[90px] text-[13px]">Order made on</p>
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
              <QuantityField field={field} isPending={isPending} />
            )}
          />
          <p className="text-desc text-sm">
            Available shares: {availableQuantity}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
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
            <PriceField
              field={field}
              isPending={isPending}
              symbol={stock.symbol}
              range={stock.range ?? undefined}
            />
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
