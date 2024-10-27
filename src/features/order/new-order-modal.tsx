'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  OrderPropsWithoutId,
  OrderSchemaWithoutId,
} from '@/features/portfolio/lib/validators';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { StockQuote } from '@/features/stock/types/stock';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderType, Portfolio } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { addOrders as addOrdersFn } from './actions/add-orders';
import { PriceInfoPopover } from './price-info-popover';

interface Props {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>;
  stock: StockQuote;
  availableQuantity?: number;
}

export const NewOrderModal = ({
  portfolio,
  stock,
  availableQuantity,
}: Props) => {
  const router = useRouter();
  const form = useForm<OrderPropsWithoutId>({
    resolver: zodResolver(OrderSchemaWithoutId),
    defaultValues: {
      stockId: stock.id,
      date: new Date().toISOString(),
      type: 'BUY' as OrderType,
      quantity: 1,
      price: stock.price,
    },
  });

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to update order.'),
    onSuccess: ({ error }) => {
      if (error) {
        return toast.error(error);
      }
      toast.success('Order created successfully');
      router.refresh();
    },
  });

  const onSubmit = (values: OrderPropsWithoutId) => {
    if (values.type === 'SELL' && values.quantity > (availableQuantity ?? 0)) {
      return toast.error(`Insufficient quantity to sell '${stock.symbol}'`);
    }

    return addOrders({
      portfolioId: portfolio.id,
      orders: [
        {
          stockId: stock.id,
          type: values.type,
          price: values.price,
          quantity: values.quantity,
          date: values.date,
        },
      ],
    });
  };

  return (
    <DialogContent className="p-0">
      <div className="flex items-start gap-3 rounded-t-md border-b bg-accent p-4">
        <SymbolItem stock={stock} />
        <Badge
          className="mt-0.5 text-white"
          style={{ backgroundColor: portfolio.color ?? '#000' }}
        >
          {portfolio.title}
        </Badge>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="f-col space-y-3 p-6 pt-2"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => <DatePicker field={field} />}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Type</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BUY">BUY</SelectItem>
                    {availableQuantity !== undefined && (
                      <SelectItem value="SELL">SELL</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-start gap-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <PriceInfoPopover className="-ml-0.5 p-1" />
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending}
                      placeholder="Custom Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="pt-3">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" isLoading={isPending}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
