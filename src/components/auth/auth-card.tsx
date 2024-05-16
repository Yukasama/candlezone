import { cn } from '@/utils/utils'
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
    <div className={cn('md:p-3 f-col gap-5 w-[400px] sm:w-[500px]', className)}>
      <div className="f-col gap-1 items-center">
        <h3 className="font-semibold text-2xl">{header}</h3>
        <p className="text-zinc-400 text-[15px]">{subHeader}</p>
      </div>
      {children}
    </div>
  )
}
