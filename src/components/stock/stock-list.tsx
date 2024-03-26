import StockItem from "./stock-item";
import { db } from "@/lib/db";
import { getQuotes } from "@/lib/fmp/quote/quote";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number;
}

interface Props extends LoadingProps {
  title?: string;
  description?: string;
  symbols: string[] | null | undefined;
  error?: string;
}

export default async function StockList({
  symbols,
  title,
  description,
  error,
  limit = 5,
  className,
}: Props) {
  if (!symbols?.length) {
    return (
      <div
        className={cn(
          className,
          "text-xl text-center font-medium text-zinc-600"
        )}>
        {error}
      </div>
    );
  }

  const symbolsToFetch = symbols.slice(0, Math.min(symbols.length, limit));

  let [stocks, quotes] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true, image: true },
      where: { symbol: { in: symbolsToFetch } },
    }),
    getQuotes(symbolsToFetch),
  ]);

  return (
    <>
      {!title && !description ? (
        <div className="space-y-2">
          {quotes?.map((quote) => (
            <StockItem
              key={quote.symbol}
              stock={stocks.find((s) => s.symbol === quote.symbol)}
              quote={quote}
            />
          ))}
        </div>
      ) : (
        <Card className={cn(className)}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {quotes?.map((quote) => (
              <StockItem
                key={quote.symbol}
                stock={stocks.find((s) => s.symbol === quote.symbol)}
                quote={quote}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
