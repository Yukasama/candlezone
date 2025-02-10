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
  close: { label: 'Close' },
  date: { label: 'Date' },
};

export const SmallChart = ({ className, history }: Readonly<Props>) => {
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
            dataKey="close"
            dot={false}
            isAnimationActive={false}
            stroke={history[0] < (history.at(-1) ?? 0) ? '#19E363' : '#e6221e'}
            strokeWidth={2.1}
            type="monotone"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
