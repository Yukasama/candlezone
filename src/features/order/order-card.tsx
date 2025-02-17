import { StockCard } from '@/app/stock-card';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OrderWithStock } from '../order/types/order';
import { DeleteOrderModal } from './delete-order-modal';
import { UpdateOrderModal } from './update-order-modal';

interface Props {
  isOwner: boolean;
  order: OrderWithStock;
}

export const OrderCard = ({ isOwner, order }: Props) => {
  return (
    <Card
      className={cn(
        'gap-3 border',
        order.deleted && 'pointer-events-none opacity-50',
      )}
      key={order.id}
    >
      <div className="relative flex flex-col justify-between">
        <div className="bg-faded flex items-start justify-between gap-2 p-2 px-4">
          <div className="flex items-start gap-2.5">
            <StockCard stock={order.stock} />
            <Badge variant={order.type === 'BUY' ? 'success' : 'destructive'}>
              {order.type}
            </Badge>
          </div>
          {order.deleted ? (
            <Badge className="absolute top-2 right-2" variant="destructive">
              Deleted
            </Badge>
          ) : (
            isOwner && (
              <div className="flex items-center gap-2">
                <UpdateOrderModal order={order} />
                <DeleteOrderModal order={order} />
              </div>
            )
          )}
        </div>
        <div className="flex items-center gap-5 p-2 px-4 text-[13px] lg:text-sm">
          <div>
            <p className="text-desc">Execution Date</p>
            <p>{order.date.toISOString().split('T')[0]}</p>
          </div>
          <div>
            <p className="text-desc">Order Type</p>
            <p>{order.type}</p>
          </div>
          <div>
            <p className="text-desc">Quantity</p>
            <p>{order.quantity}</p>
          </div>
          <div>
            <p className="text-desc">Price</p>
            <p>{order.price}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
