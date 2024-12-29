import { cn } from '@/lib/utils';
import type { Portfolio } from '@prisma/client';

interface Props {
  portfolio: Pick<Portfolio, 'title' | 'color'>;
  px?: number;
}

export const PortfolioImage = ({ portfolio, px = 40 }: Readonly<Props>) => {
  return (
    <div
      className="f-box rounded-full border"
      style={{
        backgroundColor: portfolio.color,
        height: px,
        width: px,
      }}
    >
      <p
        className={cn('text-white', px >= 30 ? 'text-lg' : 'ml-[1px] text-sm')}
      >
        {portfolio.title[0].toUpperCase()}
      </p>
    </div>
  );
};
