import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getFullPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { AddStockPortfolio } from '@/features/stock/add-stock-portfolio';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { addToRecentStocks } from '@/features/stock/lib/queries';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { ChevronsUpDown } from 'lucide-react';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_after as after } from 'next/server';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{ symbol: string }>;
}

// export const generateStaticParams = async () => {
//   const data = await db.stock.findMany({
//     select: { symbol: true },
//   });

//   const validSymbols = data.filter(({ symbol }) => isSymbolValid(symbol));
//   return validSymbols.map(({ symbol }) => ({ symbol }));
// };

export const generateMetadata = async ({ params }: Props) => {
  const { symbol } = await params;

  if (!isSymbolValid(symbol)) {
    return { title: 'Stock not found' };
  }

  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
    const quote = await getQuote({ symbol });
    if (!quote?.changesPercentage) {
      return { title: 'Stock not found' };
    }

    const change = quote.changesPercentage;
    const pos = change >= 0;
    const direction = pos ? '▲' : '▼';

    return {
      title: `${quote?.symbol} ${quote?.price?.toFixed(2)} ${direction} ${
        pos ? '+' : ''
      }${quote?.changesPercentage?.toFixed(2)}%`,
    };
  }

  return {
    title: `${symbol} 1.00 ▲ 0%`,
  };
};

export default async function SymbolLayout({
  params,
  children,
}: Readonly<Props>) {
  const { symbol } = await params;

  if (!isSymbolValid(symbol)) {
    return notFound();
  }

  const user = await getUser();
  const [stock, portfolios] = await Promise.all([
    db.stock.findFirst({
      select: {
        id: true,
        symbol: true,
        peersList: true,
        companyName: true,
        image: true,
      },
      where: { symbol },
    }),
    user ? getFullPortfoliosByUser({ userId: user?.id }) : [],
  ]);

  const peersList = await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
    },
    where: {
      symbol: {
        in: stock?.peersList?.split(','),
      },
    },
  });

  if (!stock) {
    return notFound();
  }

  after(async () => {
    if (user) {
      await addToRecentStocks({ userId: user.id, stockId: stock.id });
    }
  });

  return (
    <>
      <div className="f-center justify-between border-b p-1.5 px-2.5">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="faded"
              className="flex h-11 min-w-44 justify-between px-1.5 pr-2 sm:min-w-48"
            >
              <SymbolItem stock={stock} size="sm" />
              <ChevronsUpDown size={18} className="text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="ml-3 sm:ml-[74px]"
            sideOffset={6}
            side="bottom"
          >
            <DropdownMenuLabel className="text-[13px] text-gray-500">
              PEER STOCKS
            </DropdownMenuLabel>
            {peersList.slice(0, Math.min(6, peersList.length)).map((peer) => (
              <Link key={peer.symbol} href={`/stocks/${peer.symbol}`}>
                <DropdownMenuItem className="pr-12">
                  <SymbolItem stock={peer} size="sm" fullLength />
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="f-center gap-2">
          <AddStockPortfolio portfolios={portfolios} stock={stock} />
          <Button size="icon-sm" variant="mythic">
            Analyze
          </Button>
        </div>
      </div>
      <div>{children}</div>
    </>
  );
}
