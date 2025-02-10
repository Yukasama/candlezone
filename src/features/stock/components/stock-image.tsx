import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLImageElement> {
  src?: string | null;
  px?: number;
  priority?: boolean;
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
      className={cn('flex items-center justify-center rounded-full', className)}
      style={{ width: px, height: px }}
      {...props}
    >
      {src ? (
        <Image
          className={cn(
            'rounded-lg object-cover p-1',
            (src.includes('FIE.DE') || src.includes('AAPL')) &&
              'invert dark:invert-0',
            className,
          )}
          src={src}
          height={px}
          width={px}
          priority={priority}
          alt="Stock"
        />
      ) : (
        <div
          style={{ height: px, width: px }}
          className="bg-accent flex items-center justify-center rounded-full p-1"
        >
          <ImageOff size={18} />
        </div>
      )}
    </div>
  );
};
