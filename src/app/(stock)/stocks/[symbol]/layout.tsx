import { CustomTooltip } from '@/components/custom-tooltip';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { env } from '@/env.mjs';
import { getUser } from '@/features/auth/actions/get-user';
import { NewOrderWrapper } from '@/features/order/new-order-wrapper';
import { addToRecents } from '@/features/stock/actions/add-to-recents';
import { StockCard } from '@/features/stock/components/stock-card';
import { getStock } from '@/features/stock/lib/queries';
import { db } from '@/lib/db';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { ChevronsUpDown, Plus, Sparkles, Star } from 'lucide-react';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { type PropsWithChildren, Suspense } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{ symbol: string }>;
}

export const generateStaticParams = async () => {
  return await db.stock.findMany({
    orderBy: { marketCap: 'desc' },
    select: { symbol: true },
    take: 2000,
  });
};

export const generateMetadata = async ({ params }: Props) => {
  const { symbol } = await params;

  if (!isSymbolValid(symbol)) {
    return { title: 'Stock not found' };
  }

  if (env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
    const [stock, quote] = await Promise.all([
      db.stock.findUnique({
        select: { country: true },
        where: { symbol },
      }),
      getQuote({ symbol }),
    ]);

    if (!quote?.price) {
      return { title: 'Stock not found' };
    }

    const change = quote.changesPercentage;
    const pos = (change ?? 0) >= 0;
    const direction = pos ? '▲' : '▼';
    const isEuro = stock?.country === 'DE';

    return {
      title: `${symbol} ${isEuro ? '' : '$'}${quote.price.toFixed(2)}${isEuro ? '€' : ''} ${direction} ${
        pos ? '+' : ''
      }${quote.changesPercentage?.toFixed(2) ?? 'N/A'}%`,
    };
  }

  return { title: `${symbol} $0.00 ▲ +0.00%` };
};

export default async function SymbolLayout({
  children,
  params,
}: Readonly<Props>) {
  const { symbol } = await params;
  if (!isSymbolValid(symbol)) {
    return notFound();
  }

  const [user, stock] = await Promise.all([getUser(), getStock({ symbol })]);
  if (!stock) {
    return notFound();
  }

  const peersList = await db.stock.findMany({
    select: {
      companyName: true,
      image: true,
      sector: true,
      symbol: true,
    },
    where: { symbol: { in: stock.peersList?.split(',') } },
  });

  after(async () => {
    if (user) {
      await addToRecents({ stockId: stock.id, userId: user.id });
    }
  });

  return (
    <>
      <div className="flex items-center justify-between border-b p-1.5 px-2.5">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex h-11 min-w-44 justify-between px-1.5 pr-2 sm:min-w-48"
              variant="faded"
            >
              <StockCard stock={stock} width={190} />
              <ChevronsUpDown className="text-desc" size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="ml-3 sm:ml-[74px]"
            side="bottom"
            sideOffset={6}
          >
            <DropdownMenuLabel className="text-desc text-[13px]">
              PEER STOCKS
            </DropdownMenuLabel>
            {peersList.slice(0, Math.min(6, peersList.length)).map((peer) => (
              <Link href={`/stocks/${peer.symbol}`} key={peer.symbol}>
                <DropdownMenuItem className="pr-12">
                  <StockCard stock={peer} />
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2">
          <CustomTooltip content="Add to Watchlist" side="bottom">
            <Button aria-label="Add to watchlist" size="icon" variant="faded">
              <Star className="size-4" />
            </Button>
          </CustomTooltip>
          <Suspense
            fallback={
              <Button
                aria-label="New order modal"
                size="icon"
                variant="secondary"
              >
                <Plus size={18} />
              </Button>
            }
          >
            <NewOrderWrapper stock={stock} />
          </Suspense>
          <Button size="icon-sm" variant="gradient">
            <Sparkles className="size-4" />
            Analyze
          </Button>
        </div>
      </div>
      {children}
    </>
  );
}
