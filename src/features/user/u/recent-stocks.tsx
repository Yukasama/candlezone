import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StockItem } from '@/features/stock/components/stock-item';
import { getRecentStocksByUserId } from '@/features/stock/lib/queries';
import { getQuotes } from '@/lib/fmp/quote/quote';
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
            className="border hover:bg-accent"
            key={stock.symbol}
            stock={stock}
            quote={quotes?.find((q) => q.symbol === stock.symbol)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
