import { CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Portfolio } from '@prisma/client';
import type { HTMLAttributes } from 'react';
import { PortfolioImage } from './portfolio-image';

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<Portfolio, 'color' | 'isPublic' | 'title'>;
  size?: 'md' | 'sm' | 'xs';
}

const sizes: Record<'md' | 'sm' | 'xs', [number, string, string]> = {
  md: [40, 'text-[15px]', 'text-sm'],
  sm: [35, 'text-sm', 'text-[13px]'],
  xs: [30, 'text-[13px]', 'text-xs'],
};

export const PortfolioItem = ({
  className,
  portfolio,
  size = 'md',
}: Readonly<Props>) => {
  return (
    <div className={cn('flex items-center gap-[9px]', className)}>
      <PortfolioImage portfolio={portfolio} px={sizes[size][0]} />
      <div className="flex flex-col items-start -space-y-[3px]">
        <CardTitle
          className={cn('max-w-44 truncate text-start', sizes[size][1])}
        >
          {portfolio.title}
        </CardTitle>
        <CardDescription className={cn('text-desc', sizes[size][2])}>
          {portfolio.isPublic ? 'Public' : 'Private'}
        </CardDescription>
      </div>
    </div>
  );
};
