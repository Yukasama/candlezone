'use client'

import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import { useState, type HTMLAttributes } from 'react'

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
  const [imageError, setImageError] = useState(false)

  const handleError = () => {
    setImageError(true)
  }

  return (
    <div
      className={cn('f-box rounded-full', className)}
      style={{ width: px, height: px }}
      {...props}
    >
      {!imageError && src ? (
        <Image
          className={cn(
            `p-1 ${src.includes('AAPL') && 'invert dark:invert-0'}`,
            className
          )}
          src={src}
          height={px}
          width={px}
          priority={priority}
          alt="Stock Logo"
          onError={handleError}
        />
      ) : (
        <div
          style={{ height: px, width: px }}
          className="f-box p-1 rounded-full bg-slate-300 dark:bg-slate-700"
        >
          <ImageOff size={18} />
        </div>
      )}
    </div>
  )
}
