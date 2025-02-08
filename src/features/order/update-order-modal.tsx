'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
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
import {
  UpdateOrderProps,
  UpdateOrderSchema,
} from '@/features/order/lib/validators';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RefreshCcw, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateOrder as updateOrderFn } from './actions/update-order';
import { PriceField } from './components/price-field';
import { QuantityField } from './components/quantity-field';
import { OrderWithStock } from './types/order';

interface Props {
  order: OrderWithStock;
}

export const UpdateOrderModal = ({ order }: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateOrderProps>({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: {
      id: order.id,
      date: order.date.toISOString(),
      quantity: order.quantity,
      price: order.price,
    },
  });

  const { data, refetch, isFetching } = useQuery({
    queryFn: async () => await getQuote({ symbol: order.stock.symbol }),
    queryKey: ['quote', order.stock.symbol],
    enabled: false,
  });

  const { mutate: updateOrder, isPending } = useMutation({
    mutationFn: (values: UpdateOrderProps) =>
      updateOrderFn({ ...values, id: order.id }),
    onError: () => toast.error('Failed to update order.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
        return;
      }
      setOpen(false);
    },
  });

  useEffect(() => {
    if (data?.price) {
      form.setValue('price', data.price, { shouldValidate: true });
    }
  }, [form, data?.price]);

  return (
    <>
      <CustomTooltip side="top" content="Update order">
        <Button
          size="icon"
          variant="secondary"
          aria-label="Update order"
          onClick={() => {
            setOpen(true);
          }}
        >
          <SquarePen size={18} />
        </Button>
      </CustomTooltip>

      <ResponsiveDialog open={open} setOpen={setOpen} title="Update Order">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {
              updateOrder(form.getValues());
            })}
            className="space-y-6"
          >
            <div>
              <div className="flex h-10 items-center gap-3">
                <p className="w-24 text-[13px] text-gray-400">Symbol</p>
                <SymbolItem
                  stock={order.stock}
                  fullLength
                  className="mr-1.5"
                  size="sm"
                />
              </div>
              <div className="flex h-10 items-center gap-3">
                <p className="w-24 text-[13px] text-gray-400">Direction</p>
                <Badge
                  variant={order.type === 'BUY' ? 'success' : 'destructive'}
                >
                  {order.type === 'BUY' ? 'Buy' : 'Sell'}
                </Badge>
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div className="flex h-10 items-center gap-3">
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
                  <div className="flex items-center gap-1">
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
                    range={order.stock.range ?? undefined}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogButtons
              isPending={isPending}
              setOpen={setOpen}
              buttonText="Update"
              buttonLoadingText="Updating"
              buttonDisabled={
                !form.formState.isValid || !form.formState.isDirty
              }
            />
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
};
