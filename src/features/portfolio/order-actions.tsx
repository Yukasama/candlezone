'use client';

import { deleteOrder as deleteOrderFn } from '@/actions/portfolio/order/delete-order';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UpdateOrderModal } from '@/features/portfolio/update-order-modal';
import { cn } from '@/lib/utils';
import { OrderWithStock } from '@/types/portfolio';
import { useMutation } from '@tanstack/react-query';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HTMLAttributes } from 'react';
import { toast } from 'sonner';

interface Props extends HTMLAttributes<HTMLDivElement> {
  order: OrderWithStock;
}

export const OrderActions = ({ order, className }: Props) => {
  const router = useRouter();

  const { mutate: deleteOrder } = useMutation({
    mutationFn: deleteOrderFn,
    onError: () => toast.error('Failed to delete order.'),
    onSuccess: ({ error }) => {
      if (error) {
        return toast.error(error);
      }
      router.refresh();
    },
  });

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Action"
            className={cn(className)}
          >
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <div className="f-center gap-1.5">
                <SquarePen size={16} />
                Update Order
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-1.5 hover:bg-red-500/90"
            onClick={() => deleteOrder({ orderId: order.id })}
          >
            <Trash2 size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateOrderModal order={order} />
    </Dialog>
  );
};
