import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import { OrderWithStock } from '../order/types/order';
import { DeleteOrder } from './delete-order';
import { UpdateOrder } from './update-order';

interface Props {
  order: OrderWithStock;
}

export const OrderCard = ({ order }: Props) => {
  return (
    <Card
      className={cn(
        'gap-3 border',
        order.deleted && 'pointer-events-none opacity-50',
      )}
      key={order.id}
    >
      <div className="f-col relative justify-between">
        <div className="bg-faded flex items-start justify-between gap-2 p-2 px-4">
          <div className="flex items-start gap-2.5">
            <SymbolItem stock={order.stock} size="sm" fullLength />
            <Badge
              className={cn(
                'bg-red-500/80 text-white',
                order.type === 'BUY' ? 'bg-emerald-500' : 'bg-price-down',
              )}
            >
              {order.type}
            </Badge>
          </div>
          {order.deleted ? (
            <Badge className="absolute right-2 top-2 bg-red-500/80 text-white">
              Deleted
            </Badge>
          ) : (
            <div className="f-center gap-2">
              <UpdateOrder order={order} />
              <DeleteOrder order={order} />
            </div>
          )}
        </div>
        <div className="f-center gap-5 p-2 px-4 text-[13px] lg:text-sm">
          <div>
            <p className="text-gray-400">Execution Date</p>
            <p>{order.date.toISOString().split('T')[0]}</p>
          </div>
          <div>
            <p className="text-gray-400">Order Type</p>
            <p>{order.type}</p>
          </div>
          <div>
            <p className="text-gray-400">Quantity</p>
            <p>{order.quantity}</p>
          </div>
          <div>
            <p className="text-gray-400">Price</p>
            <p>{order.price}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
