import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StockItem from "@/components/stock/stock-item";
import { getQuotes } from "@/actions/fmp/quote";
import { User } from "next-auth";
import { getRecentStocksByUserId } from "@/lib/data/stock";

interface Props {
  user: Pick<User, "id">;
}

export default async function RecentStocks({ user }: Props) {
  const recentStocks = await getRecentStocksByUserId(user.id);

  if (!recentStocks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Stocks</CardTitle>
          <CardDescription>Stocks that were recently viewed</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-zinc-400">No stocks explored yet.</p>
        </CardContent>
      </Card>
    );
  }

  const quotes = await getQuotes(recentStocks.map(({ stock }) => stock.symbol));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Stocks</CardTitle>
        <CardDescription>Stocks that were recently viewed</CardDescription>
      </CardHeader>

      <CardContent>
        {recentStocks.map(({ stock }) => (
          <StockItem
            key={stock.symbol}
            stock={stock}
            quote={quotes?.find((q) => q.symbol === stock.symbol)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
