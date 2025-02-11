'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteOrder as deleteOrderFn } from './actions/delete-order';
import { OrderWithStock } from './types/order';

interface Props {
  order: OrderWithStock;
}

export const DeleteOrderModal = ({ order }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const { isPending, mutate: deleteOrder } = useMutation({
    mutationFn: deleteOrderFn,
    onError: (error) => toast.error(error.message),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Order successfully deleted.');
    },
  });

  const onSubmit = () => {
    if (input !== 'CONFIRM') {
      toast.warning("Please enter 'CONFIRM' to delete this order.");
      return;
    }
    deleteOrder({ orderId: order.id });
    setOpen(false);
  };

  return (
    <>
      <CustomTooltip content="Delete order" side="top">
        <Button
          aria-label="Delete order"
          onClick={() => setOpen(true)}
          size="icon"
          variant="destructive"
        >
          <Trash2 size={18} />
        </Button>
      </CustomTooltip>

      <ResponsiveDialog
        description="This action cannot be undone."
        open={open}
        setOpen={setOpen}
        title={`Delete Order for ${order.stock.symbol}?`}
      >
        <form className="space-y-6" onSubmit={onSubmit}>
          <section>
            <div className="flex h-10 items-center gap-3">
              <p className="text-desc w-24 text-[13px]">Symbol</p>
              <SymbolItem
                className="mr-1.5"
                fullLength
                size="sm"
                stock={order.stock}
              />
            </div>
            <div className="flex h-10 items-center gap-3">
              <p className="text-desc w-24 text-[13px]">Direction</p>
              <Badge variant={order.type === 'BUY' ? 'success' : 'destructive'}>
                {order.type === 'BUY' ? 'Buy' : 'Sell'}
              </Badge>
            </div>
            <div className="flex h-10 items-center gap-3">
              <p className="text-desc w-24 text-[13px]">Order made on</p>
              <p className="text-[13px]">{format(order.date, 'PPP')}</p>
            </div>
          </section>

          <Separator />

          <section>
            <Input
              aria-label="Confirm deletion of order"
              className="text-base"
              onChange={(e) => setInput(e.target.value)}
              placeholder="CONFIRM"
              value={input}
            />
            <p className="text-desc pointer-events-none p-1 text-sm">
              Enter &apos;CONFIRM&apos; to delete this order.
            </p>
          </section>

          <DialogButtons
            buttonDisabled={input !== 'CONFIRM'}
            buttonLoadingText="Deleting"
            buttonText="I am sure, delete"
            isPending={isPending}
            setOpen={setOpen}
          />
        </form>
      </ResponsiveDialog>
    </>
  );
};
