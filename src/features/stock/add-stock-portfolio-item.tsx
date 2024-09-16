'use client';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { StockQuote } from '@/features/stock/types/stock';
import { NewOrderModal } from '../order/new-order-modal';
import { PortfolioItem } from '../portfolio/components/portfolio-item';

interface Props {
  portfolio: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >;
  stock: StockQuote;
}

export const AddStockPortfolioItem = ({
  portfolio,
  stock,
}: Readonly<Props>) => {
  const hasOrders = portfolio.orders.some(
    (order) => order.stockId === stock.id,
  );

  let availableQuantity;
  if (hasOrders) {
    availableQuantity = 0;
    for (const order of portfolio.orders) {
      if (order.stockId === stock.id) {
        availableQuantity += order.quantity;
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <PortfolioItem
          size="sm"
          portfolio={portfolio}
          className="w-full rounded-md p-1 px-2 hover:bg-accent"
        />
      </DialogTrigger>
      <NewOrderModal
        portfolioId={portfolio.id}
        stock={stock}
        availableQuantity={availableQuantity}
      />
    </Dialog>
  );
};
