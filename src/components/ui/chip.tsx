'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, CircleX } from 'lucide-react'
import React, { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string
  isError?: boolean
}

export const Chip = ({ message, isError, className }: Readonly<Props>) => {
  return (
    <div
      className={cn(
        `text-sm rounded-md p-1 px-2.5 self-center ${
          isError ? 'bg-red-500' : 'bg-green-500'
        }`,
        className
      )}
    >
      <div className="flex items-center gap-2 text-white">
        {isError ? <CircleX size={18} /> : <CheckCircle size={18} />}
        {message}
      </div>
    </div>
  )
}
