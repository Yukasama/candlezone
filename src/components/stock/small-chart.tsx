'use client';

import { cn } from '@/lib/utils';
import { History } from '@/types/stock';
import { HTMLAttributes, useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { Loader } from '../loader';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: History[];
  className?: string;
}

export default function SmallChart({ history, className }: Readonly<Props>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={cn('f-box h-[50px] w-[200px]', className)}>
      {mounted && history ? (
        <ResponsiveContainer width="100%">
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
        </ResponsiveContainer>
      ) : (
        <Loader size={32} />
      )}
    </div>
  );
}
