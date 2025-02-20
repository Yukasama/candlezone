import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getRecentStocks } from '@/features/stock/actions/get-recent-stocks';
import { StockCard } from '@/features/stock/components/stock-card';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';

export const RecentStocks = async () => {
  const recentStocks = await getRecentStocks({});

  if (recentStocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Stocks</CardTitle>
          <CardDescription>Stocks that were recently viewed</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-desc text-lg">No stocks explored yet.</p>
        </CardContent>
      </Card>
    );
  }

  const stockQuotes = await getStockQuotes(recentStocks);

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Recent Stocks</CardTitle>
        <CardDescription>Stocks that were recently viewed</CardDescription>
      </CardHeader>

      <CardContent>
        {stockQuotes.map((stock) => (
          <StockCard
            asLink
            className="min-w-full"
            key={stock.symbol}
            showPrice
            stock={stock}
          />
        ))}
      </CardContent>
    </Card>
  );
};
