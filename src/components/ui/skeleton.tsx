import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export const Skeleton = ({
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div
      className={cn('bg-accent/80 animate-pulse rounded-full', className)}
      {...props}
    />
  );
};
