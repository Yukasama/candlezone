import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export const Skeleton = ({
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-full bg-accent dark:bg-accent/50',
        className,
      )}
      {...props}
    />
  );
};

interface Props extends Readonly<HTMLAttributes<HTMLDivElement>> {
  length: number;
}

export const SkeletonList = ({ length, className }: Props) => {
  return Array.from({ length }, (_, i) => (
    <Skeleton
      className={cn('my-1 h-14 w-full', className)}
      key={`skeleton-${String(i)}`}
    />
  ));
};
