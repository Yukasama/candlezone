'use client';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
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
import { PriceInfoPopover } from './price-info-popover';

interface Props {
  order: OrderWithStock;
}

export const UpdateOrderModal = ({ order }: Props) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const form = useForm<UpdateOrderProps>({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: {
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
        return toast.error(error);
      }
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Update order">
          <SquarePen size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0" aria-describedby={undefined}>
        <DialogTitle className="hidden">Update order</DialogTitle>
        <SymbolItem
          stock={order.stock}
          className="bg-faded rounded-t-md border-b p-4"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => updateOrder(form.getValues()))}
          >
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
            <DialogFooter className="p-6 pt-0">
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
    </Dialog>
  );
};
