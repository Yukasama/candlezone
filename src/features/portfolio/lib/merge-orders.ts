import { OrderWithStock } from '@/features/order/types/order';

type MergedOrder = Pick<
  OrderWithStock,
  'price' | 'quantity' | 'stock' | 'stockId' | 'type'
>;

export const mergeOrders = (orders: MergedOrder[]) => {
  const stockMap = new Map<
    string,
    {
      order: MergedOrder;
      quantity: number;
      totalValue: number;
    }
  >();

  for (const order of orders) {
    const existing = stockMap.get(order.stockId);
    const amount = order.type === 'BUY' ? order.quantity : -order.quantity;
    const newQuantity = existing ? existing.quantity + amount : amount;

    const totalValue = existing
      ? existing.totalValue + order.price * amount
      : order.price * amount;

    if (newQuantity > 0) {
      stockMap.set(order.stockId, {
        order: existing?.order ?? order,
        quantity: newQuantity,
        totalValue,
      });
    } else {
      stockMap.delete(order.stockId);
    }
  }

  return stockMap;
};
