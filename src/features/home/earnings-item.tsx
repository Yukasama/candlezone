import { Badge } from '@/components/ui/badge';
import { StockImage } from '@/features/stock/components/stock-image';
import type { Stock } from '@prisma/client';
import Link from 'next/link';

interface Props {
  stock: Pick<
    Stock,
    | 'symbol'
    | 'companyName'
    | 'image'
    | 'earningsEpsEstimated'
    | 'earningsRevenueEstimated'
    | 'earningsRevenue'
    | 'earningsEps'
  >;
}

export const EarningsItem = ({ stock }: Props) => {
  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className="f-col w-14 items-center rounded-md bg-accent p-1"
    >
      <StockImage src={stock.image} />
      <Badge className="bg-faded mt-1 px-1.5 py-0 text-[10px] font-semibold text-black dark:text-white">
        {stock.symbol}
      </Badge>
    </Link>
  );
};
