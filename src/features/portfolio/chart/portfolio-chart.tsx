'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { cn } from '@/lib/utils';
import { Check, Settings } from 'lucide-react';
import { useState } from 'react';
import { ChartPerformance } from './chart-performance';
import { PortfolioChartContent } from './portfolio-chart-content';
import { usePortfolioHistory } from './use-portfolio-history';

interface Props {
  portfolio: PortfolioWithQuotes;
}

export const PortfolioChart = ({ portfolio }: Readonly<Props>) => {
  const [excludeQuantity, setExcludeQuantity] = useState(false);
  const [showRealizedPL, setShowRealizedPL] = useState(true);

  const { chartData, refetch, isLoading, isError } = usePortfolioHistory({
    portfolio,
    options: { excludeQuantity, showRealizedPL },
  });

  const emptyPortfolio = portfolio.orders.length === 0;

  return (
    <div className="f-col w-full gap-3 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="Chart settings" variant="secondary">
            <Settings className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem
            onClick={() => setExcludeQuantity((prev) => !prev)}
            className="flex justify-between gap-2"
          >
            Exclude Quantity
            <Check
              className={cn(
                !emptyPortfolio && excludeQuantity ? 'flex' : 'hidden',
                'size-4',
              )}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowRealizedPL((prev) => !prev)}
            className="flex justify-between gap-2"
          >
            Show realized P/L
            <Check
              className={cn(
                !emptyPortfolio && showRealizedPL ? 'flex' : 'hidden',
                'size-4',
              )}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PortfolioChartContent
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        chartData={chartData}
        emptyPortfolio={emptyPortfolio}
      />

      <div className="f-center justify-between">
        <ChartPerformance chartData={chartData} />
      </div>
    </div>
  );
};
