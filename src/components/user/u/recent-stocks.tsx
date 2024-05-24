import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StockItem } from '@/components/stock/stock-item'
import { getQuotes } from '@/lib/fmp/quote/quote'
import { User } from 'next-auth'
import { getRecentStocksByUserId } from '@/utils/queries/stock'

interface Props {
  user: Pick<User, 'id'>
}

export default async function RecentStocks({ user }: Readonly<Props>) {
  const recentStocks = await getRecentStocksByUserId(user.id)

  if (!recentStocks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Stocks</CardTitle>
          <CardDescription>Stocks that were recently viewed</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-slate-400">No stocks explored yet.</p>
        </CardContent>
      </Card>
    )
  }

  const quotes = await getQuotes(recentStocks.map(({ stock }) => stock.symbol))

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Recent Stocks</CardTitle>
        <CardDescription>Stocks that were recently viewed</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {recentStocks.map(({ stock }) => (
          <StockItem
            className="border hover:bg-faded"
            key={stock.symbol}
            stock={stock}
            quote={quotes?.find((q) => q.symbol === stock.symbol)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
