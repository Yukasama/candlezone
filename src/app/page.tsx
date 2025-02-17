import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { siteConfig } from '@/config/site';
import { NewsSlider } from '@/features/home/news-slider';
import { WhatsNext } from '@/features/home/whats-next';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { db } from '@/lib/db';
import { Suspense } from 'react';
import { StockCard } from './stock-card';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default async function Homepage() {
  const stocks = await db.stock.findMany({
    orderBy: { marketCap: 'desc' },
    select: {
      companyName: true,
      earningsDate: true,
      id: true,
      image: true,
      marketCap: true,
      sector: true,
      symbol: true,
    },
    take: 5,
    where: {
      symbol: { not: { contains: '.', in: ['AXTLF', 'GOOGL'] } },
    },
  });

  const stockQuotes = await getStockQuotes(stocks);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-3">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold xl:text-3xl">
          Whats happening today?
        </h1>
        <NewsSlider />

        <Suspense fallback={<SkeletonGrid />}>
          <WhatsNext />
        </Suspense>

        <div className="flex w-full gap-2">
          <Card className="bg-accent/20 border/20 border shadow-none">
            <CardHeader>
              <CardTitle>Top S&P 500 Stocks</CardTitle>
              <CardDescription>Highest Stocks in Market Cap</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {stockQuotes.map((stock) => (
                <StockCard asLink key={stock.id} showPrice stock={stock} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
