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
  length?: number;
}

export const SkeletonList = ({ length = 3, className }: Props) => {
  return (
    <div className="f-col gap-1">
      {Array.from({ length }, (_, i) => (
        <Skeleton
          className={cn('h-14 w-full', className)}
          key={`skeleton-${String(i)}`}
        />
      ))}
    </div>
  );
};
