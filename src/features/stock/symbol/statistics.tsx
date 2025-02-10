import type { Stock } from '@prisma/client';
import { TriangleAlert } from 'lucide-react';
import { getFinancials } from '../lib/get-financials';
import { DividendChart } from './dividend-chart';
import { MarginChart } from './margin-chart';
import { MetricsChart } from './metrics-chart';

interface Props {
  stock: Pick<Stock, 'id' | 'companyName'>;
}

export const Statistics = async ({ stock }: Readonly<Props>) => {
  const financials = await getFinancials({ stockId: stock.id });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!financials || financials.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <TriangleAlert className="text-desc size-5" />
        <p className="text-desc text-sm">
          No data available. Please refresh the page.
        </p>
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
    <div className="flex grid-cols-2 flex-col gap-8 py-3 sm:py-6 md:grid">
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">
            Key Metrics for {stock.companyName}
          </p>
          <p className="text-desc text-sm">
            Showing key metrics for the last 8 years
          </p>
        </div>
        <MetricsChart data={statConfig} />
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Margins for {stock.companyName}</p>
          <p className="text-desc text-sm">
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
          <p className="text-desc text-sm">
            Showing dividend yield for the last 8 years
          </p>
        </div>
        <DividendChart data={dividendConfig} />
      </div>
    </div>
  );
};
