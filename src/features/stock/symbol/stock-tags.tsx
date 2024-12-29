import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import Link from 'next/link';

interface Props {
  stock: Pick<Stock, 'sector' | 'industry' | 'country'>;
}

export const StockTags = ({ stock }: Props) => {
  const attributes = [
    { name: 'sector', value: stock.sector },
    { name: 'industry', value: stock.industry },
    { name: 'country', value: stock.country },
  ];

  return (
    <div className="flex flex-wrap gap-1">
      {attributes.map(({ name, value }) => (
        <Link
          key={name}
          prefetch={false}
          href={`/stocks?${name}=${String(value)}`}
          className={cn(
            badgeVariants(),
            'motion-preset-slide-down-md whitespace-nowrap',
            name === 'industry' && 'hidden lg:flex',
          )}
        >
          {value}
        </Link>
      ))}
    </div>
  );
};
