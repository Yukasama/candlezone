import { cn } from '@/lib/utils';
import type { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

export const PageLayout = ({
  children,
  className,
  ...props
}: Readonly<Props>) => {
  return (
    <div className="f-col grid-cols-7 lg:grid" {...props}>
      <div></div>
      <div className={cn('f-col col-span-5 p-6 lg:p-10', className)}>
        {children}
      </div>
      <div className="f-col gap-4 p-6"></div>
    </div>
  );
};
