'use client';

import { shouldInvertImage } from '@/config/invert-images';
import { wsrvLoader } from '@/lib/image-loader';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { HTMLAttributes, useState } from 'react';

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
  const [hasError, setHasError] = useState(false);

  const handleNewSrc = () => {
    if (hasError) {
      setHasError(false);
    }
  };

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ height: px, width: px }}
      {...props}
    >
      {src && !hasError ? (
        <Image
          alt="Stock Logo"
          className={cn(
            'rounded-lg object-cover p-1',
            shouldInvertImage({ src }) && 'invert dark:invert-0',
            className,
          )}
          height={px}
          key={src}
          loader={wsrvLoader}
          onError={() => setHasError(true)}
          onLoad={handleNewSrc}
          priority={priority}
          src={src}
          width={px}
        />
      ) : (
        <ImageOff
          className="text-desc size-4"
          style={{ height: px / 1.5, width: px / 1.5 }}
        />
      )}
    </div>
  );
};
