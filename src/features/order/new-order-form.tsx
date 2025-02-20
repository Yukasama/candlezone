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
import { StockCard } from '@/features/stock/components/stock-card';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Stock } from '@prisma/client';
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
  portfolios?: PortfolioWithQuotes[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  stock: Pick<Stock, 'companyName' | 'id' | 'image' | 'range' | 'symbol'>;
}

export const NewOrderForm = ({
  portfolios = [],
  setOpen,
  stock,
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
    for (const { quantity, stockId } of selectedPortfolio.orders) {
      if (stockId === stock.id) {
        summedQuantity += quantity ?? 0;
      }
    }
    return summedQuantity;
  }, [selectedPortfolio, stock.id]);

  const form = useForm<OrderPropsWithoutId>({
    defaultValues: {
      date: new Date().toISOString(),
      price: 0,
      quantity: 1,
      stockId: stock.id,
      type: 'BUY',
    },
    resolver: zodResolver(OrderSchemaWithoutId),
  });

  const { isPending, mutate: addOrders } = useMutation({
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
      orders: [{ ...values, stockId: stock.id }],
      portfolioId,
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div className="flex h-10 items-center gap-3">
            <p className="text-desc w-24 text-[13px]">Symbol</p>
            <StockCard stock={stock} />
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
                  onClick={() => setPortfolioId(portfolio.id)}
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
            Available shares: {availableQuantity ?? 0}
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
                    onClick={() => field.onChange('BUY')}
                    size="sm"
                    type="button"
                    variant={field.value === 'BUY' ? 'success' : 'secondary'}
                  >
                    BUY
                  </Button>
                  <Button
                    disabled={
                      isPending ||
                      (availableQuantity ?? 0) < form.getValues('quantity')
                    }
                    onClick={() => field.onChange('SELL')}
                    size="sm"
                    type="button"
                    variant={
                      field.value === 'SELL' ? 'destructive' : 'secondary'
                    }
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
              range={stock.range ?? undefined}
              symbol={stock.symbol}
            />
          )}
        />

        <DialogButtons
          buttonDisabled={!portfolioId}
          buttonLoadingText="Submitting"
          buttonText="Submit"
          isPending={isPending}
          setOpen={setOpen}
        />
      </form>
    </Form>
  );
};
