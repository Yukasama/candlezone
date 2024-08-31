import { ChartData } from '@/types/stock';
import { Dot } from 'recharts';

interface LastDotProps {
  cx?: number;
  cy?: number;
  index?: string | number;
  chartData?: ChartData;
}

export const LastDot = ({ cx, cy, index, chartData }: LastDotProps) => {
  if (index === (chartData?.results.length ?? 0) - 1) {
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={4}
        fill={chartData?.positive ? '#1de095' : '#e52b34'}
      />
    );
  }
};
