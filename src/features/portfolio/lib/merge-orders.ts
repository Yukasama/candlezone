import { OrderWithStock } from '../types/portfolio';

export const mergeOrders = (orders: OrderWithStock[]) => {
  const stockMap = new Map<
    string,
    {
      quantity: number;
      order: OrderWithStock;
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
