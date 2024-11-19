import { OrderWithStock } from '../types/portfolio';

type MergedOrder = Pick<
  OrderWithStock,
  'stockId' | 'quantity' | 'type' | 'price' | 'stock'
>;

export const mergeOrders = (orders: MergedOrder[]) => {
  const stockMap = new Map<
    string,
    {
      quantity: number;
      order: MergedOrder;
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
        quantity: newQuantity,
        order: existing?.order ?? order,
        totalValue,
      });
    } else {
      stockMap.delete(order.stockId);
    }
  }

  return stockMap;
};
