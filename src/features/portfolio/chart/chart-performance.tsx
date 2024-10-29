import { cn } from '@/lib/utils';
import { PortfolioChartData } from '../types/history';

export const ChartPerformance = ({
  chartData,
}: {
  chartData?: PortfolioChartData;
}) => {
  return (
    <div className="f-center justify-between">
      <div className="bg-faded flex rounded border p-2 px-4">
        <div className="w-24 border-r">
          <p className="text-gray-400">Today</p>
          <strong
            className={cn(
              chartData?.positive ? 'text-price-up' : 'text-price-down',
            )}
          >
            ${chartData?.today.toFixed(2) ?? 'N/A'}
          </strong>
        </div>
        <div className="w-24 pl-2">
          <p className="text-gray-400">All Time</p>
          <strong
            className={cn(
              (chartData?.endPrice ?? 0) >= 0
                ? 'text-price-up'
                : 'text-price-down',
            )}
          >
            ${chartData?.endPrice.toFixed(2) ?? 'N/A'}
          </strong>
        </div>
      </div>
    </div>
  );
};
