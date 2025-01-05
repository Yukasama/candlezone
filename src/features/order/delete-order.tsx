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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { OrderWithStock } from '../order/types/order';
import { deleteOrder as deleteOrderFn } from './actions/delete-order';

interface Props {
  order: OrderWithStock;
}

export const DeleteOrder = ({ order }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteOrder, isPending } = useMutation({
    mutationFn: deleteOrderFn,
    onError: (error) => toast.error(error.message),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Order successfully deleted.');
      router.refresh();
    },
  });

  function onSubmit() {
    if (input !== 'CONFIRM') {
      toast.warning("Please enter 'CONFIRM' to delete this order.");
      return;
    }
    deleteOrder({ orderId: order.id });
    setOpen(false);
  }

  return (
    <>
      <CustomTooltip side="top" content="Delete order">
        <Button
          size="icon"
          variant="destructive"
          aria-label="Delete order"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash2 size={18} />
        </Button>
      </CustomTooltip>

      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title={`Delete Order for ${order.stock.symbol}?`}
        description="This action cannot be undone."
      >
        <form onSubmit={onSubmit} className="space-y-6">
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
              <Badge variant={order.type === 'BUY' ? 'success' : 'destructive'}>
                {order.type === 'BUY' ? 'Buy' : 'Sell'}
              </Badge>
            </div>
            <div className="f-center h-10 gap-3">
              <p className="w-24 text-[13px] text-gray-400">Order made on</p>
              <p className="text-[13px]">{format(order.date, 'PPP')}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Input
              placeholder="CONFIRM"
              aria-label="Confirm deletion of order"
              className="text-base"
              autoFocus
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <p className="p-1 text-sm text-gray-400">
              Enter &apos;CONFIRM&apos; to delete this order.
            </p>
          </div>

          <DialogButtons
            isPending={isPending}
            setOpen={setOpen}
            buttonText="I am sure, delete"
            buttonLoadingText="Deleting"
            buttonDisabled={input !== 'CONFIRM'}
          />
        </form>
      </ResponsiveDialog>
    </>
  );
};
