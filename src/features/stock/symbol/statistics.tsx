import { db } from '@/lib/db';
import { Stock } from '@prisma/client';
import { TriangleAlert } from 'lucide-react';
import { DividendChart } from './dividend-chart';
import { MarginChart } from './margin-chart';
import { MetricsChart } from './metrics-chart';

interface Props {
  stock: Pick<Stock, 'symbol' | 'companyName'>;
}

export const Statistics = async ({ stock }: Readonly<Props>) => {
  const financials = await db.financials.findMany({
    select: {
      priceEarningsRatio: true,
      priceToSalesRatio: true,
      priceToBookRatio: true,
      priceEarningsToGrowthRatio: true,
      grossProfitMargin: true,
      operatingProfitMargin: true,
      netProfitMargin: true,
      dividendYield: true,
    },
    where: {
      symbol: stock.symbol,
      date: { gte: '2015-01-01' },
    },
    orderBy: { date: 'desc' },
    take: 8,
  });

  if (!financials?.length) {
    return (
      <div className="f-col h-64 items-center justify-center">
        <TriangleAlert className="size-5 text-gray-400" />
        <p className="text-sm text-gray-400">No data available</p>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - financials.length;
  const chartYearRange = Math.max(2015, startYear);

  const labels = Array.from({ length: currentYear - chartYearRange }, (_, i) =>
    (chartYearRange + i).toString(),
  );

  const statConfig = labels.map((label, i) => ({
    name: label,
    pe: financials.at(-1 - i)?.priceEarningsRatio ?? undefined,
    pb: financials.at(-1 - i)?.priceToBookRatio ?? undefined,
    ps: financials.at(-1 - i)?.priceToSalesRatio ?? undefined,
  }));

  const marginConfig = labels.map((label, i) => ({
    name: label,
    gm: financials.at(-1 - i)?.grossProfitMargin ?? undefined,
    om: financials.at(-1 - i)?.operatingProfitMargin ?? undefined,
    pm: financials.at(-1 - i)?.netProfitMargin ?? undefined,
  }));

  const dividendConfig = labels.map((label, i) => ({
    name: label,
    div: financials.at(-1 - i)?.dividendYield ?? undefined,
  }));

  return (
    <div className="f-col grid-cols-2 gap-8 py-3 sm:py-6 md:grid">
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">
            Key Metrics for {stock.companyName}
          </p>
          <p className="text-sm text-gray-400">
            Showing key metrics for the last 8 years
          </p>
        </div>
        <MetricsChart data={statConfig} />
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Margins for {stock.companyName}</p>
          <p className="text-sm text-gray-400">
            Showing margin data for the last 8 years
          </p>
        </div>
        <MarginChart data={marginConfig} />
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">
            Dividend Yield for {stock.companyName}
          </p>
          <p className="text-sm text-gray-400">
            Showing dividend yield for the last 8 years
          </p>
        </div>
        <DividendChart data={dividendConfig} />
      </div>
    </div>
  );
};
