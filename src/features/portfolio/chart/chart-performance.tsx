import { CustomTooltip } from '@/components/custom-tooltip';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { PortfolioChartData } from '../types/history';

interface ChartPerformanceProps {
  chartData?: PortfolioChartData;
  isLoading?: boolean;
}

export const ChartPerformance = ({
  chartData,
  isLoading = false,
}: ChartPerformanceProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const todayReturn = chartData?.today ?? 0;
  const allTimeReturn = chartData?.endPrice ?? 0;
  const todayPercentage =
    (todayReturn / (allTimeReturn - todayReturn)) * 100 || 0;
  const isPositive = todayReturn >= 0;

  return (
    <div className="grid grid-cols-2 gap-4 px-1 pt-1 lg:gap-6">
      <Card className="group relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex gap-6">
          <CustomTooltip content="Today's Performance" side="bottom">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Today
              </div>
              <div className="flex items-baseline gap-2">
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-price-up" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-price-down" />
                )}
                <span
                  className={cn(
                    'text-xl font-semibold tracking-tight transition-colors lg:text-2xl lg:font-bold',
                    isPositive ? 'text-price-up' : 'text-price-down',
                  )}
                >
                  {isPositive ? '+' : ''}
                  {todayReturn.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    isPositive ? 'text-price-up' : 'text-price-down',
                  )}
                >
                  ({isPositive ? '+' : ''}
                  {todayPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </CustomTooltip>
          <Separator className="h-14 w-[1px]" />
        </div>
      </Card>

      <Card className="group relative overflow-hidden transition-all hover:shadow-md">
        <CustomTooltip content="All Time Performance" side="bottom">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              All Time
            </div>
            <div className="flex items-baseline gap-2">
              {allTimeReturn >= 0 ? (
                <TrendingUp className="h-5 w-5 text-price-up" />
              ) : (
                <TrendingDown className="h-5 w-5 text-price-down" />
              )}
              <span
                className={cn(
                  'text-2xl font-bold tracking-tight transition-colors',
                  allTimeReturn >= 0 ? 'text-price-up' : 'text-price-down',
                )}
              >
                {allTimeReturn >= 0 ? '+' : ''}
                {allTimeReturn.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            </div>
          </div>
        </CustomTooltip>
      </Card>
    </div>
  );
};
