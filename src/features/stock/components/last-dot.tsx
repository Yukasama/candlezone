import { PortfolioChartData } from '@/features/portfolio/types/history';
import { ChartData } from '@/features/stock/types/history';
import { Dot } from 'recharts';

interface LastDotProps {
  cx?: number;
  cy?: number;
  index?: string | number;
  chartData?: ChartData | PortfolioChartData;
}

export const LastDot = ({ cx, cy, index, chartData }: LastDotProps) => {
  if (index === (chartData?.results.length ?? 0) - 1) {
    const fill = chartData?.positive ? '#1de095' : '#e52b34';
    return <Dot cx={cx} cy={cy} r={4} fill={fill} />;
  }
};
