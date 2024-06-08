import { cn } from '@/lib/utils'
import { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  header: string
  subHeader: string
  children: ReactNode
}

export const AuthCard = ({
  header,
  subHeader,
  children,
  className,
}: Readonly<Props>) => {
  return (
    <div className={cn('f-col w-[400px] gap-4 sm:w-[500px] md:p-3', className)}>
      <div className="f-col items-center gap-0.5">
        <h3 className="text-2xl font-semibold">{header}</h3>
        <p className="text-[15px] text-gray-400">{subHeader}</p>
      </div>
      {children}
    </div>
  )
}
