import PortfolioAllocation from '@/features/portfolio/p/portfolio-allocation'
import { PortfolioAssets } from '@/features/portfolio/p/portfolio-assets'
import { PortfolioChart } from '@/features/portfolio/p/portfolio-chart'
import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function PortfolioPage({
  params: { id },
}: Readonly<Props>) {
  const portfolio = await db.portfolio.findFirst({
    include: {
      stocks: {
        select: {
          stockId: true,
          stock: {
            select: {
              id: true,
              symbol: true,
              companyName: true,
              image: true,
              peRatioTTM: true,
              sector: true,
            },
          },
        },
      },
    },
    where: { id },
  })

  if (!portfolio) {
    return notFound()
  }

  const user = await getUser()
  const isOwner = portfolio.userId === user?.id

  const stockQuotes = await getStockQuotes(
    portfolio.stocks.map((stocks) => {
      return {
        id: stocks.stock.id,
        symbol: stocks.stock.symbol,
        companyName: stocks.stock.companyName,
        image: stocks.stock.image,
        sector: stocks.stock.sector,
      }
    }),
  )

  return (
    <div className="f-col px-6 xl:flex-row">
      <PortfolioChart portfolio={{ id: portfolio.id }} className="border-r" />
      <div>
        <PortfolioAssets
          stockQuotes={stockQuotes}
          portfolio={portfolio}
          isOwner={isOwner}
        />
        <PortfolioAllocation stocks={stockQuotes} />
      </div>
    </div>
  )
}
