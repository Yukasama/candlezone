import Image from 'next/image'
import { SITE } from '@/config/site'
import { cn } from '@/utils/utils'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLImageElement> {
  px?: number
  priority?: boolean
}

export const CompanyLogo = ({
  px = 30,
  className,
  priority = false,
  ...props
}: Readonly<Props>) => {
  return (
    <div
      className={cn('f-box rounded-full', className)}
      style={{ width: px, height: px }}
      {...props}
    >
      <Image
        className={cn('rounded-full', className)}
        src="/logo.png"
        width={px}
        height={px}
        alt={`${SITE.name} Logo`}
        priority={priority}
      />
    </div>
  )
}
