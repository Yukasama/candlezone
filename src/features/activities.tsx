import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDailys } from '@/lib/fmp/quote/dailys';
import { ActivityQuote, findStockForActivity } from '@/lib/fmp/quote/quote';
import { StockPageItem } from '../features/stock/stock-page-item';

export const Activities = async () => {
  const [activesData, winnersData, losersData] = await Promise.all([
    getDailys('actives'),
    getDailys('winners'),
    getDailys('losers'),
  ]);

  const [actives, winners, losers] = await Promise.all([
    findStockForActivity(activesData),
    findStockForActivity(winnersData),
    findStockForActivity(losersData),
  ]);

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
  ];

  return (
    <div className="hidden justify-between gap-3 lg:flex">
      {activities.map((activity) => (
        <Card key={activity.title} className="bg-faded flex-1 border px-1">
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
  );
};
