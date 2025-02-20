'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  UpdateOrderProps,
  UpdateOrderSchema,
} from '@/features/order/lib/validators';
import { StockCard } from '@/features/stock/components/stock-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
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
    defaultValues: {
      date: order.date.toISOString(),
      id: order.id,
      price: order.price,
      quantity: order.quantity,
    },
    resolver: zodResolver(UpdateOrderSchema),
  });

  const { isPending, mutate: updateOrder } = useMutation({
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

  return (
    <>
      <CustomTooltip content="Update order" side="top">
        <Button
          aria-label="Update order"
          onClick={() => setOpen(true)}
          size="icon"
          variant="secondary"
        >
          <SquarePen size={18} />
        </Button>
      </CustomTooltip>

      <ResponsiveDialog open={open} setOpen={setOpen} title="Update Order">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(() => {
              updateOrder(form.getValues());
            })}
          >
            <div>
              <div className="flex h-10 items-center gap-3">
                <p className="text-desc w-24 text-[13px]">Symbol</p>
                <StockCard stock={order.stock} />
              </div>
              <div className="flex h-10 items-center gap-3">
                <p className="text-desc w-24 text-[13px]">Direction</p>
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
                  fetchDisabled
                  field={field}
                  isPending={isPending}
                  range={order.stock.range ?? undefined}
                  symbol={order.stock.symbol}
                />
              )}
            />

            <DialogButtons
              buttonDisabled={
                !form.formState.isValid || !form.formState.isDirty
              }
              buttonLoadingText="Updating"
              buttonText="Update"
              isPending={isPending}
              setOpen={setOpen}
            />
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
};
