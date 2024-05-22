import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import PortfolioAllocation from '@/components/portfolio/p/portfolio-allocation'
import { getStockQuotes } from '@/lib/fmp/quote/quote'
import { PortfolioChart } from '@/components/portfolio/p/portfolio-chart'
import { PortfolioAssets } from '@/components/portfolio/p/portfolio-assets'
import { getUser } from '@/lib/auth'

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
    })
  )

  return (
    <div className="f-col gap-6">
      <PortfolioChart portfolio={{ id: portfolio.id }} />
      <div className="f-col xl:flex-row gap-6">
        <PortfolioAllocation stocks={portfolio.stocks.map((s) => s.stock)} />
        <PortfolioAssets
          stockQuotes={stockQuotes}
          portfolio={portfolio}
          isOwner={isOwner}
        />
      </div>
    </div>
  )
}
