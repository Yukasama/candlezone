import { cn } from '@/utils/cn'
import { LoaderIcon } from 'lucide-react'
import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

export const Loader = ({ size = 18, className }: Readonly<Props>) => {
  return <LoaderIcon size={size} className={cn('animate-spin', className)} />
}
