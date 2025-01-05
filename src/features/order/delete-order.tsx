'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { OrderWithStock } from '../portfolio/types/portfolio';
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
