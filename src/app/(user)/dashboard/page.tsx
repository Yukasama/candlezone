import { PortfolioItem } from '@/components/portfolio/portfolio-item'
import { StockImage } from '@/components/stock/stock-image'
import { buttonVariants } from '@/components/ui/button'
import { AddStockPortfolio } from '@/features/stock/add-stock-portfolio'
import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getQuotes } from '@/lib/fmp/quote/quote'
import { getRecentStocksByUserId } from '@/utils/queries/stock'
import { ArrowBigDown, ArrowBigUp, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

export default async function Dashboard() {
  const user = await getUser()

  const [stocks, portfolios] = await Promise.all([
    getRecentStocksByUserId(user?.id, 12),
    db.portfolio.findMany({
      include: {
        stocks: {
          select: {
            stockId: true,
            stock: {
              select: { symbol: true, image: true, companyName: true },
            },
          },
        },
      },
      where: { userId: user?.id },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const quotes = await getQuotes(stocks.map((stock) => stock.stock.symbol))

  return (
    <div className="f-col grid-cols-4 lg:grid">
      <div className="f-col gap-4 bg-gray-200/40 p-8 dark:bg-gray-800/30">
        <div className="flex justify-between">
          <h3 className="text-xl font-medium">My Portfolios</h3>
          <Link href="/portfolio" className={buttonVariants({ size: 'sm' })}>
            <Plus size={16} />
            <p className="text-[13px]">Create new</p>
          </Link>
        </div>
        <div className="f-col gap-2.5">
          {portfolios.length ? (
            portfolios.map((portfolio) => (
              <Link
                href={`/p/${portfolio.id}`}
                className="flex items-center justify-between rounded-md border bg-background p-2.5 px-4 text-sm hover:bg-background/50"
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
            ))
          ) : (
            <p className="text-gray-400">No portfolios created yet.</p>
          )}
        </div>
      </div>
      <div className="f-col col-span-2 gap-4 border-x p-8">
        <div className="flex justify-between">
          <h3 className="text-xl font-medium">Recent Activity</h3>
          <Link href="/" className={buttonVariants({ size: 'sm' })}>
            <ExternalLink size={16} />
            <p className="text-[13px]">View stocks</p>
          </Link>
        </div>
        <div className="f-col gap-4">
          {stocks.length ? (
            stocks.map(({ stock }) => {
              const quote = quotes?.find(
                (quote) => quote.symbol === stock.symbol,
              )
              return (
                <div
                  key={stock.symbol + 2}
                  className="f-col bg-faded gap-4 rounded-md border p-5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      className="flex items-center gap-4"
                    >
                      <StockImage src={stock.image} px={50} />
                      <div>
                        <p className="text-base font-semibold">
                          {stock.companyName}
                        </p>
                        <p className="text-sm font-semibold text-gray-400">
                          {stock.symbol}
                        </p>
                      </div>
                    </Link>
                    <div className="f-col items-end">
                      <p className="font-semibold">
                        ${quote?.price?.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-0.5 text-sm font-semibold">
                        {(quote?.changesPercentage ?? 0) > 0 ? (
                          <ArrowBigUp size={16} className="text-price-up" />
                        ) : (
                          <ArrowBigDown size={16} className="text-price-down" />
                        )}
                        <span
                          className={`${
                            (quote?.changesPercentage ?? 0) > 0
                              ? 'text-price-up'
                              : 'text-price-down'
                          }`}
                        >
                          {quote?.changesPercentage
                            ?.toFixed(2)
                            .replace('-', '')}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-4 text-sm md:gap-6">
                      <div className="f-col">
                        <p className="text-gray-400">Sector</p>
                        {stock.sector}
                      </div>
                      <div className="f-col">
                        <p className="text-gray-400">P/E Ratio</p>
                        {stock.peRatioTTM?.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <AddStockPortfolio
                        stock={stock}
                        portfolios={portfolios}
                      />
                      <Link
                        className={buttonVariants({
                          variant: 'mythic',
                          size: 'small-icon',
                        })}
                        aria-label="View stock"
                        href={`/stocks/${stock.symbol}`}
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-gray-400">No recent activity.</p>
          )}
        </div>
      </div>
      <div className="lg:f-col hidden"></div>
    </div>
  )
}
