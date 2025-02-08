import { cn } from '@/lib/utils';
import type { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

export const PageLayout = ({
  children,
  className,
  ...props
}: Readonly<Props>) => {
  return (
    <div className="flex grid-cols-7 flex-col lg:grid" {...props}>
      <div></div>
      <div className={cn('col-span-5 flex flex-col p-6 lg:pt-12', className)}>
        {children}
      </div>
      <div className="flex flex-col gap-4 p-6"></div>
    </div>
  );
};
