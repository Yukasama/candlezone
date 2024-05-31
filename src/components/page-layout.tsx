import { cn } from '@/lib/utils'
import type { HTMLAttributes, PropsWithChildren } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

export const PageLayout = ({
  children,
  className,
  ...props
}: Readonly<Props>) => {
  return (
    <div className="f-col md:grid grid-cols-7" {...props}>
      <div></div>
      <div className={cn('col-span-5 f-col p-6 md:p-10', className)}>
        {children}
      </div>
      <div className="f-col gap-4 p-6"></div>
    </div>
  )
}
