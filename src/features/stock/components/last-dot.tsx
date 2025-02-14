import { PortfolioChartData } from '@/features/portfolio/types/history';
import { ChartData } from '@/features/stock/types/history';
import { Dot } from 'recharts';

interface LastDotProps {
  chartData?: ChartData | PortfolioChartData;
  cx?: number;
  cy?: number;
  i?: number | string;
}

export const LastDot = ({ chartData, cx, cy, i }: LastDotProps) => {
  if (i === (chartData?.results.length ?? 0) - 1) {
    const fill = chartData?.positive ? '#1de095' : '#e52b34';
    return <Dot cx={cx} cy={cy} fill={fill} r={4} />;
  }
};
