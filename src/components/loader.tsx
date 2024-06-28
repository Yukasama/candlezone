import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

export const Loader = ({ size = 48, className }: Readonly<Props>) => {
  return (
    <Image
      src="/spinner.svg"
      className={cn('dark:invert', className)}
      width={size}
      height={size}
      alt="loading"
    />
  )
}
