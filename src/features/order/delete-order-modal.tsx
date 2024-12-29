'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

export const DeleteOrderModal = ({ order }: Readonly<Props>) => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" aria-label="Delete order">
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-54 truncate">
            Delete Order for {order.stock.symbol}?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            placeholder="CONFIRM"
            aria-label="Confirm deletion of order"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <p className="p-1 text-sm text-gray-400">
            Enter &apos;CONFIRM&apos; to delete this order.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={onSubmit}
          >
            I am sure, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
