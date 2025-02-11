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

  const { chartData, isError, isLoading, refetch } = usePortfolioHistory({
    options: { excludeQuantity, showRealizedPL },
    portfolio,
  });

  const emptyPortfolio = portfolio.orders.length === 0;

  return (
    <div className="flex w-full flex-col gap-3 border-b">
      <div className="flex justify-between px-4 pt-4">
        <div className="flex items-center justify-between">
          <ChartPerformance chartData={chartData} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Chart settings" size="icon" variant="secondary">
              <Settings className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              className="flex justify-between gap-2"
              onClick={() => setExcludeQuantity((prev) => !prev)}
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
              className="flex justify-between gap-2"
              onClick={() => setShowRealizedPL((prev) => !prev)}
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
      </div>

      <PortfolioChartContent
        chartData={chartData}
        emptyPortfolio={emptyPortfolio}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
      />
    </div>
  );
};
