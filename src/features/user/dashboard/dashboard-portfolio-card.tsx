import { PortfolioItem } from '@/components/portfolio/portfolio-item';
import { StockImage } from '@/components/stock/stock-image';
import { PortfolioWithQuotes } from '@/types/portfolio';
import Link from 'next/link';

interface Props {
  portfolio: PortfolioWithQuotes;
}

export const DashboardPortfolioCard = ({ portfolio }: Props) => {
  return (
    <Link
      href={`/p/${portfolio.id}`}
      className="f-center justify-between rounded-md border bg-background p-2 px-3.5 text-sm hover:bg-background/50"
      key={portfolio.id}
    >
      <PortfolioItem portfolio={portfolio} size="sm" />

      <div className="grid grid-cols-4 gap-1">
        {portfolio.orders.slice(0, 8).map(({ stock }) => (
          <StockImage key={stock.symbol} src={stock.image} px={25} />
        ))}

        {portfolio.orders.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-faded size-[25px]" />
          ))}
      </div>
    </Link>
  );
};
