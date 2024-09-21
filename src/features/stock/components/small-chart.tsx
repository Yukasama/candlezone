'use client';

import { History } from '@/features/stock/types/history';
import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';
import { Line, LineChart, YAxis } from 'recharts';
import { Loader } from '../../../components/loader';
import { ChartContainer } from '../../../components/ui/chart';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: History[];
}

const chartConfig = {
  date: {
    label: 'Date',
  },
  close: {
    label: 'Close',
  },
};

export const SmallChart = ({ history, className }: Readonly<Props>) => {
  return (
    <div className={cn('f-box h-[50px] w-[200px]', className)}>
      {history ? (
        <ChartContainer config={chartConfig}>
          <LineChart data={history}>
            <YAxis domain={['dataMin', 'dataMax']} hide={true} />
            <Line
              type="monotone"
              dataKey="close"
              stroke={
                history[0] < (history.at(-1) ?? 0) ? '#19E363' : '#e6221e'
              }
              strokeWidth={2.1}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      ) : (
        <Loader size={32} />
      )}
    </div>
  );
};
