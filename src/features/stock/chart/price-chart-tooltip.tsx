import { Card } from '@/components/ui/card';
import { ChartData } from '@/features/stock/types/history';
import { cn } from '@/lib/utils';

export const PriceChartTooltip = ({
  active,
  payload,
  label,
  chartData,
}: {
  active: boolean;
  payload: { value: number }[];
  label: string;
  chartData: ChartData;
}) => {
  if (active && payload?.length && chartData) {
    const price = payload[0].value;
    const percentageChange = (
      (price / Number(chartData.startPrice)) * 100 -
      100
    ).toFixed(2);

    return (
      <Card className="f-col gap-1.5 p-3">
        <div className="flex gap-1.5">
          <div
            className={cn(
              'h-[38px] w-[3px] rounded-md',
              chartData.positive ? 'bg-emerald-500' : 'bg-red-500',
            )}
          />
          <div className="f-col gap-1">
            <p className="text-[15px] font-semibold">{label}</p>
            <div className="f-center gap-1.5 text-sm">
              <p className="text-gray-400">Price:</p>
              <p
                className={cn(
                  'font-semibold',
                  chartData.positive ? 'text-price-up' : 'text-price-down',
                )}
              >
                ${price.toFixed(2)}
                <span
                  className={cn(
                    'ml-1.5 rounded-full p-0.5 px-2 text-[13px] font-semibold text-white',
                    chartData.positive ? 'bg-emerald-500' : 'bg-price-down',
                  )}
                >
                  {Number(percentageChange) > 0 ? '+' : ''}
                  {percentageChange}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }
};
