'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, CircleX } from 'lucide-react'
import React, { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string
  size?: 'sm' | 'md'
  isError?: boolean
}

export const Chip = ({
  message,
  size = 'md',
  isError,
  className,
}: Readonly<Props>) => {
  const isSmall = size === 'sm'

  return (
    <div
      className={cn(
        `rounded-md text-sm ${
          isSmall ? 'p-[3px] px-1.5' : 'p-1 px-2.5'
        } self-center ${isError ? 'bg-red-500' : 'bg-green-500'}`,
        className
      )}
    >
      <div
        className={`flex items-center ${
          isSmall ? 'gap-1.5' : 'gap-2'
        } text-white`}
      >
        {isError ? (
          <CircleX size={isSmall ? 16 : 18} />
        ) : (
          <CheckCircle size={isSmall ? 16 : 18} />
        )}
        <p className={isSmall ? 'text-sm' : ''}>{message}</p>
      </div>
    </div>
  )
}
