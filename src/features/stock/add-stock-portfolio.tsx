import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { StockQuote } from '@/features/stock/types/stock';
import { Plus } from 'lucide-react';
import { AddStockPortfolioContent } from './add-stock-portfolio-content';

interface Props {
  stock?: StockQuote;
  portfolios?: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[];
}

export const AddStockPortfolio = ({ stock, portfolios }: Readonly<Props>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="faded" aria-label="Add stock to portfolio">
          <Plus size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-5" side="bottom" sideOffset={6}>
        <AddStockPortfolioContent stock={stock} portfolios={portfolios} />
      </PopoverContent>
    </Popover>
  );
};
