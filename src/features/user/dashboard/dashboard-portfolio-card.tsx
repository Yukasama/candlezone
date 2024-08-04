import { PortfolioItem } from '@/components/portfolio/portfolio-item'
import { StockImage } from '@/components/stock/stock-image'
import { PortfolioWithStocks } from '@/types/portfolio'
import Link from 'next/link'

interface Props {
  portfolio: PortfolioWithStocks
}

export const DashboardPortfolioCard = ({ portfolio }: Props) => {
  return (
    <Link
      href={`/p/${portfolio.id}`}
      className="f-center justify-between rounded-md border bg-background p-2.5 px-4 text-sm hover:bg-background/50"
      key={portfolio.id + 1}
    >
      <PortfolioItem portfolio={portfolio} />
      <div className="grid grid-cols-4 gap-1">
        {portfolio.stocks.slice(0, 8).map((stock) => (
          <StockImage
            key={stock.stock.symbol}
            src={stock.stock.image}
            px={27}
          />
        ))}
      </div>
    </Link>
  )
}
