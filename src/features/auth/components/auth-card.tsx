import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  header: string;
  subHeader: string;
}

export const AuthCard = ({
  children,
  className,
  header,
  subHeader,
}: Readonly<Props>) => {
  return (
    <div
      className={cn(
        'flex w-[400px] flex-col gap-4 sm:w-[500px] md:p-3',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-0.5">
        <strong className="text-2xl font-semibold">{header}</strong>
        <p className="text-desc text-[15px]">{subHeader}</p>
      </div>
      {children}
    </div>
  );
};
