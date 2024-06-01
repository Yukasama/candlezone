import { getDailys } from '@/lib/fmp/quote/dailys'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockPageItem } from '../features/stock/stock-page-item'
import { ActivityQuote, findStockForActivity } from '@/lib/fmp/quote/quote'

export const Activities = async () => {
  const [activesData, winnersData, losersData] = await Promise.all([
    getDailys('actives'),
    getDailys('winners'),
    getDailys('losers'),
  ])

  const [actives, winners, losers] = await Promise.all([
    findStockForActivity(activesData),
    findStockForActivity(winnersData),
    findStockForActivity(losersData),
  ])

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
    <div className="justify-between hidden lg:flex gap-3">
      {activities.map((activity) => (
        <Card key={activity.title} className="flex-1 px-1 bg-faded border">
          <CardHeader>
            <CardTitle>{activity.title}</CardTitle>
          </CardHeader>
          <CardContent className="f-col gap-2">
            {activity.stocks.map((stock: ActivityQuote) => (
              <StockPageItem key={stock.symbol} stock={stock} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
