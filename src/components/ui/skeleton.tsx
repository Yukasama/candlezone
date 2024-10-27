import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export const Skeleton = ({
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div
      className={cn('rounded-full border bg-accent', className)}
      {...props}
    />
  );
};
