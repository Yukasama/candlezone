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
import { Loader, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
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

  const [angle, setAngle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startAngle, setStartAngle] = useState<number | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Convert pointer position to angle in degrees around container center
  const getAngleFromCenter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) {
      return 0;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const radians = Math.atan2(dy, dx);
    return (radians * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
    setIsPointerDown(true);
    setStartAngle(getAngleFromCenter(e));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown || startAngle == undefined) {
      return;
    }

    const currentAngle = getAngleFromCenter(e);
    let diff = currentAngle - startAngle;

    if (diff > 180) {
      diff -= 360;
    }
    if (diff < -180) {
      diff += 360;
    }

    if (Math.abs(diff) > 8) {
      const delta = Math.sign(diff);
      const qty = form.getValues('quantity');
      // Stop if at 1 and user tries to scroll backward
      if (!(qty === 1 && delta < 0)) {
        form.setValue('quantity', Math.max(1, qty + delta));
        setAngle((prev) => prev + delta * 8);
        setStartAngle(currentAngle);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).releasePointerCapture(e.pointerId);
    setIsPointerDown(false);
    setStartAngle(null);
  };

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
                      <div className="mt-2 flex items-center justify-center">
                        <div
                          ref={containerRef}
                          className="relative h-20 w-20 select-none overflow-hidden rounded-full bg-background"
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                        >
                          <Loader
                            size={55}
                            style={{ transform: `rotate(${angle}deg)` }}
                            className="absolute left-[16%] top-[16%] text-gray-500"
                          />
                        </div>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-20"
                          disabled={isPending}
                          {...field}
                        />
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
              buttonDisabled={!form.formState.isValid}
            />
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
};
