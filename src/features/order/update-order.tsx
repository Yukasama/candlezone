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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { OrderWithStock } from '../order/types/order';
import { updateOrder as updateOrderFn } from './actions/update-order';
import { PriceField } from './components/price-field';
import { QuantityField } from './components/quantity-field';

interface Props {
  order: OrderWithStock;
}

export const UpdateOrder = ({ order }: Props) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const form = useForm<UpdateOrderProps>({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: {
      id: order.id,
      date: order.date.toISOString(),
      quantity: order.quantity,
      price: order.price,
    },
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
      router.refresh();
    },
  });

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
              <div className="f-center h-10 gap-3">
                <p className="w-24 text-[13px] text-gray-400">Symbol</p>
                <SymbolItem
                  stock={order.stock}
                  fullLength
                  className="mr-1.5"
                  size="sm"
                />
              </div>
              <div className="f-center h-10 gap-3">
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
                  <FormLabel>Price</FormLabel>
                  <PriceField
                    field={field}
                    isPending={isPending}
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
