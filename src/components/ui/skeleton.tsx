import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export const Skeleton = ({
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  return <div className={cn('skeleton rounded-full', className)} {...props} />;
};

interface Props extends Readonly<HTMLAttributes<HTMLDivElement>> {
  length?: number;
}

export const SkeletonList = ({ className, length = 3 }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length }, (_, i) => (
        <Skeleton
          className={cn('h-14 w-full', className)}
          key={`skeleton-${String(i)}`}
        />
      ))}
    </div>
  );
};

export const SkeletonGrid = ({ className, length = 8 }: Props) => {
  return (
    <div className="grid h-36 grid-cols-4 gap-1.5">
      {Array.from({ length }).map((_, i) => (
        <Skeleton
          className={cn('rounded-lg', className)}
          key={`${String(i)}-skeleton`}
        />
      ))}
    </div>
  );
};
