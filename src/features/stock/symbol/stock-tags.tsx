import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import Link from 'next/link';

interface Props {
  stock: Pick<Stock, 'country' | 'industry' | 'sector'>;
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
          className={cn(
            badgeVariants(),
            'motion-preset-slide-down-md whitespace-nowrap',
            name === 'industry' && 'hidden lg:flex',
          )}
          href={`/stocks?${name}=${String(value)}`}
          key={name}
          prefetch={false}
        >
          {value}
        </Link>
      ))}
    </div>
  );
};
