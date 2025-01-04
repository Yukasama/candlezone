'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { OrderWithStock } from '../portfolio/types/portfolio';
import { updateOrder as updateOrderFn } from './actions/update-order';

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
    mutationFn: (values: UpdateOrderProps) => {
      return updateOrderFn({
        ...values,
        id: order.id,
      });
    },
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
            <div className="space-y-2">
              <div className="f-center gap-3">
                <p className="w-24 text-[13px] text-gray-400">Symbol</p>
                <SymbolItem
                  stock={order.stock}
                  fullLength
                  className="mr-1.5"
                  size="sm"
                />
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div className="f-center gap-3.5">
                    <p className="w-18 text-[13px] text-gray-400">
                      Order made on
                    </p>
                    <DatePicker field={field} />
                  </div>
                )}
              />
            </div>

            <Separator />

            <div className="flex gap-3">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" disabled={isPending} {...field} />
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
            </div>

            <DialogButtons
              isPending={isPending}
              setOpen={setOpen}
              buttonText="Update"
              buttonLoadingText="Updating"
            />
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
};
