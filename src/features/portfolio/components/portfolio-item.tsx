import { CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Portfolio } from '@prisma/client';
import type { HTMLAttributes } from 'react';
import { PortfolioImage } from './portfolio-image';

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>;
  size?: 'xs' | 'sm' | 'md';
}

const sizes: Record<'xs' | 'sm' | 'md', [number, string]> = {
  xs: [30, 'text-[13px]', 'text-xs'],
  sm: [35, 'text-sm', 'text-[13px]'],
  md: [40, 'text-[15px]', 'text-sm'],
};

export const PortfolioItem = ({
  portfolio,
  size = 'md',
  className,
}: Readonly<Props>) => {
  return (
    <div className={cn('f-center gap-[9px]', className)}>
      <PortfolioImage portfolio={portfolio} px={sizes[size][0]} />
      <div className="f-col items-start -space-y-[3px]">
        <CardTitle
          className={cn('max-w-32 truncate text-start', sizes[size][1])}
        >
          {portfolio.title}
        </CardTitle>
        <CardDescription className={cn('text-gray-400', sizes[size][2])}>
          {portfolio.isPublic ? 'Public' : 'Private'}
        </CardDescription>
      </div>
    </div>
  );
};
