import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'
import { siteConfig } from '@/config/site'

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
        alt={`${siteConfig.name} Logo`}
        priority={priority}
      />
    </div>
  )
}
