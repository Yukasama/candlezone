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
