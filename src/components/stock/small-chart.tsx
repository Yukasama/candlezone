'use client'

import { History } from '@/types/stock'
import { useState, useEffect, HTMLAttributes } from 'react'
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts'
import { Spinner } from '@nextui-org/spinner'
import { cn } from '@/utils/utils'

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: History[]
  className?: string
}

export default function SmallChart({ history, className }: Readonly<Props>) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className={cn('w-[200px] h-[50px] f-box', className)}>
      {mounted && history ? (
        <ResponsiveContainer width="100%">
          <LineChart data={history}>
            <YAxis domain={['dataMin', 'dataMax']} hide={true} />
            <Line
              type="monotone"
              dataKey="close"
              stroke={
                history[0] < history[history.length - 1] ? '#19E363' : '#e6221e'
              }
              strokeWidth={2.1}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Spinner size="sm" />
      )}
    </div>
  )
}
