import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export const Skeleton = ({
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-full bg-accent dark:bg-accent/30',
        className,
      )}
      {...props}
    />
  );
};
