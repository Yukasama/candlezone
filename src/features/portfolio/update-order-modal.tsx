'use client';

import { updateOrder as updateOrderFn } from '@/actions/portfolio/order/update-order';
import { SymbolItem } from '@/components/stock/symbol-item';
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
  UpdateOrderProps,
  UpdateOrderSchema,
} from '@/lib/validators/portfolio';
import { OrderWithStock } from '@/types/portfolio';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PriceInfoPopover } from './price-info-popover';

interface Props {
  order: OrderWithStock;
}

export const UpdateOrderModal = ({ order }: Props) => {
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
        id: order.id,
        date: values.date,
        price: values.price,
        quantity: values.quantity,
      });
    },
    onSuccess: (data) => {
      if (data?.error) {
        return toast.error(data.error);
      }
      router.refresh();
    },
  });

  return (
    <DialogContent className="p-0">
      <SymbolItem
        stock={order.stock}
        className="bg-faded rounded-t-md border-b p-4"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => updateOrder(form.getValues()))}>
          <div className="f-col items-start gap-4 p-6 pb-7 pt-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => <DatePicker field={field} />}
            />
            <div className="flex gap-4">
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
          </div>
          <DialogFooter className="bg-faded border-t p-4">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" isLoading={isPending}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
