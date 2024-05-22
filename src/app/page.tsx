import { getDailys } from '@/lib/fmp/quote/dailys'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import StockPageItem from '../components/stock/stock-page-item'
import { getUser } from '@/lib/auth'
import { getPortfoliosByUserId } from '@/utils/queries/portfolio'
import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'
import { LandingTable } from '../components/landing-table'
import { siteConfig } from '@/config/site'

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
}

export default async function Homepage() {
  const user = await getUser()
  const [portfolios, stocks, actives, winners, losers] = await Promise.all([
    getPortfoliosByUserId({ userId: user?.id }),
    db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        companyName: true,
        image: true,
        sector: true,
        industry: true,
        country: true,
        exchange: true,
        mktCap: true,
      },
      where: {
        symbol: { not: { in: ['GOOGL', 'BRK-A'], contains: '.' } },
        isEtf: false,
        isFund: false,
        isActivelyTrading: true,
        exchange: { not: 'Other OTC' },
      },
      orderBy: { mktCap: 'desc' },
      take: 500,
    }),
    getDailys('actives'),
    getDailys('winners'),
    getDailys('losers'),
  ])

  const stockQuotes = await getStockQuotes(stocks)
  const stocksWithRank = stockQuotes.map((stock, i) => ({
    ...stock,
    rank: i + 1,
  }))

  const activities = [
    {
      title: 'Most Active',
      stocks: actives,
    },
    {
      title: 'Daily Winners',
      stocks: winners,
    },
    {
      title: 'Daily Losers',
      stocks: losers,
    },
  ]

  return (
    <div className="f-col gap-10 m-6 md:mx-8 lg:mx-16 xl:mx-24">
      <div className="justify-between hidden lg:flex gap-4">
        {activities.map((activity) => (
          <Card
            key={activity.title}
            className="flex-1 px-2 bg-background border"
          >
            <CardHeader className="font-semibold text-lg">
              {activity.title}
            </CardHeader>
            <CardContent className="f-col gap-2">
              {activity.stocks
                ?.slice(0, 3)
                .map((stock: any) => (
                  <StockPageItem key={stock.symbol} quote={stock} />
                ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {stocksWithRank && (
        <LandingTable stocks={stocksWithRank} portfolios={portfolios} />
      )}
    </div>
  )
}
