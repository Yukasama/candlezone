import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getRecentStocks } from '@/features/stock/actions/get-recent-stocks';
import { StockItem } from '@/features/stock/components/stock-item';
import { getQuotes } from '@/lib/fmp/quote/get-quote';

export const RecentStocks = async () => {
  const recentStocks = await getRecentStocks({});

  if (!recentStocks || recentStocks.length === 0) {
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

  const quotes = await getQuotes({
    symbols: recentStocks.map((stock) => stock.symbol),
  });

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Recent Stocks</CardTitle>
        <CardDescription>Stocks that were recently viewed</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {recentStocks.map((stock) => (
          <StockItem
            className="hover:bg-accent border"
            key={stock.symbol}
            quote={quotes?.find((q) => q.symbol === stock.symbol)}
            stock={stock}
          />
        ))}
      </CardContent>
    </Card>
  );
};
