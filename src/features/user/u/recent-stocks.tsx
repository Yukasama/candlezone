import { StockItem } from '@/components/stock/stock-item';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getQuotes } from '@/lib/fmp/quote/quote';
import { getRecentStocksByUserId } from '@/utils/queries/stock';
import { User } from 'next-auth';

interface Props {
  user: Pick<User, 'id'>;
}

export const RecentStocks = async ({ user }: Readonly<Props>) => {
  const recentStocks = await getRecentStocksByUserId(user.id);

  if (recentStocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Stocks</CardTitle>
          <CardDescription>Stocks that were recently viewed</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-gray-400">No stocks explored yet.</p>
        </CardContent>
      </Card>
    );
  }

  const quotes = await getQuotes(recentStocks.map(({ stock }) => stock.symbol));

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Recent Stocks</CardTitle>
        <CardDescription>Stocks that were recently viewed</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {recentStocks.map(({ stock }) => (
          <StockItem
            className="hover:bg-faded border"
            key={stock.symbol}
            stock={stock}
            quote={quotes?.find((q) => q.symbol === stock.symbol)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
