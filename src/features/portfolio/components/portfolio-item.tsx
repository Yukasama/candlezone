import { CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Portfolio } from '@prisma/client';
import { HTMLAttributes } from 'react';
import { PortfolioImage } from './portfolio-image';

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>;
  size?: 'xs' | 'sm' | 'md';
}

export const PortfolioItem = ({
  portfolio,
  size = 'md',
  className,
}: Readonly<Props>) => {
  return (
    <div className={cn('f-center gap-[9px]', className)}>
      <PortfolioImage
        portfolio={portfolio}
        px={size === 'xs' ? 30 : size === 'sm' ? 35 : 40}
      />
      <div className="f-col items-start -space-y-[3px]">
        <CardTitle
          className={cn(
            size === 'xs'
              ? 'text-[13px]'
              : size === 'sm'
                ? 'text-sm'
                : 'text-[15px]',
            'max-w-32 truncate text-start',
          )}
        >
          {portfolio.title}
        </CardTitle>
        <CardDescription
          className={cn(
            'text-gray-400',
            size === 'xs'
              ? 'text-xs'
              : size === 'sm'
                ? 'text-[13px]'
                : 'text-sm',
          )}
        >
          {portfolio.isPublic ? 'Public' : 'Private'}
        </CardDescription>
      </div>
    </div>
  );
};
