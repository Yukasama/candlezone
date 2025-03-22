import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { siteConfig } from '@/config/site';
import { SectorPerformanceChart } from '@/features/home/sector-chart';
import { WhatsNext } from '@/features/home/whats-next';
import { StockCard } from '@/features/stock/components/stock-card';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { db } from '@/lib/db';
import { getSectorPerformance } from '@/lib/fmp/info/get-sector-performance';
import { Suspense } from 'react';

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
    where: { symbol: { not: { contains: '.', in: ['AXTLF', 'GOOGL'] } } },
  });

  const stockQuotes = await getStockQuotes(stocks);
  const sectorPerformance = await getSectorPerformance();

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-3">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold xl:text-3xl">
          Whats happening today?
        </h1>
        <Suspense fallback={<SkeletonGrid length={4} />}>
          <WhatsNext />
        </Suspense>

        <Separator />

        <div className="flex flex-col items-start gap-2 lg:flex-row">
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

          {sectorPerformance && (
            <SectorPerformanceChart data={sectorPerformance} />
          )}
        </div>
      </div>
    </div>
  );
}
