import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  px?: number;
  src?: null | string;
}

export const StockImage = ({
  className,
  priority,
  px = 40,
  src,
  ...props
}: Readonly<Props>) => {
  return (
    <div
      className={cn('flex items-center justify-center rounded-none', className)}
      style={{ height: px, width: px }}
      {...props}
    >
      {src ? (
        <Image
          alt="Stock"
          className={cn(
            'rounded-lg object-cover p-1',
            (src.includes('FIE.DE') || src.includes('AAPL')) &&
              'invert dark:invert-0',
            className,
          )}
          height={px}
          priority={priority}
          src={src}
          width={px}
        />
      ) : (
        <div
          className="bg-accent flex items-center justify-center rounded-sm p-1"
          style={{ height: px, width: px }}
        >
          <ImageOff size={18} />
        </div>
      )}
    </div>
  );
};
