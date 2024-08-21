'use client'

import { deleteOrder as deleteOrderFn } from '@/actions/portfolio/order/delete-order'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UpdateOrderModal } from '@/features/portfolio/update-order-modal'
import { OrderWithStock } from '@/types/portfolio'
import { useMutation } from '@tanstack/react-query'
import { MoreVertical, SquarePen, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  order: OrderWithStock
}

export const OrderActions = ({ order }: Props) => {
  const router = useRouter()

  const { mutate: deleteOrder } = useMutation({
    mutationFn: () => {
      return deleteOrderFn({
        orderId: order.id,
      })
    },
    onError: () => toast.error('Failed to create order.'),
    onSuccess: () => router.refresh(),
  })

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary" aria-label="Action">
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-faded">
          <DropdownMenuItem className="gap-1.5">
            <DialogTrigger asChild>
              <div className="f-center gap-1.5">
                <SquarePen size={16} />
                Update Order
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-1.5" onClick={() => deleteOrder()}>
            <Trash2 size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateOrderModal order={order} />
    </Dialog>
  )
}
