'use client';

import { ChartContainer } from '@/components/ui/chart';
import { History } from '@/lib/fmp/types/history';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import { Line, LineChart, YAxis } from 'recharts';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: History[];
}

const chartConfig = {
  date: { label: 'Date' },
  close: { label: 'Close' },
};

export const SmallChart = ({ history, className }: Readonly<Props>) => {
  return (
    <div
      className={cn(
        'flex h-[50px] w-[200px] items-center justify-center',
        className,
      )}
    >
      <ChartContainer config={chartConfig}>
        <LineChart data={history}>
          <YAxis domain={['dataMin', 'dataMax']} hide={true} />
          <Line
            type="monotone"
            dataKey="close"
            stroke={history[0] < (history.at(-1) ?? 0) ? '#19E363' : '#e6221e'}
            strokeWidth={2.1}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
