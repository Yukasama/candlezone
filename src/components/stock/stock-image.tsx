import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLImageElement> {
  src?: string | null
  px?: number
  priority?: boolean
}

export const StockImage = ({
  src,
  priority,
  px = 40,
  className,
  ...props
}: Readonly<Props>) => {
  return (
    <div
      className={cn('f-box rounded-full', className)}
      style={{ width: px, height: px }}
      {...props}
    >
      {src ? (
        <Image
          className={cn(
            `p-1 ${src.includes('AAPL') && 'invert dark:invert-0'}`,
            className
          )}
          src={src}
          height={px}
          width={px}
          priority={priority}
          alt=""
        />
      ) : (
        <div
          style={{ height: px, width: px }}
          className="f-box rounded-full bg-gray-300 p-1 dark:bg-gray-700"
        >
          <ImageOff size={18} />
        </div>
      )}
    </div>
  )
}
