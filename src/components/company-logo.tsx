import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  px?: number;
}

export const CompanyLogo = ({
  className,
  priority = false,
  px = 30,
  ...props
}: Readonly<Props>) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-transparent',
        className,
      )}
      style={{ height: px, width: px }}
      {...props}
    >
      <Image
        alt={`${siteConfig.name} Logo`}
        className={cn('rounded-full', className)}
        height={px}
        priority={priority}
        src="/output.png"
        width={px}
      />
    </div>
  );
};
