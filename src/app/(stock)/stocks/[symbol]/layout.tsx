import { CustomTooltip } from '@/components/custom-tooltip';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser } from '@/features/auth/actions/get-user';
import { NewOrderModal } from '@/features/order/new-order-modal';
import { getFullPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { addToRecents } from '@/features/stock/actions/add-to-recents';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { getStock } from '@/features/stock/lib/queries';
import { db } from '@/lib/db';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { ChevronsUpDown, Sparkles, Star } from 'lucide-react';
import { PHASE_PRODUCTION_SERVER } from 'next/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{ symbol: string }>;
}

export const generateStaticParams = async () => {
  return await db.stock.findMany({
    select: { symbol: true },
  });
};

export const generateMetadata = async ({ params }: Props) => {
  const { symbol } = await params;

  if (!isSymbolValid(symbol)) {
    return { title: 'Stock not found' };
  }

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_SERVER) {
    const quote = await getQuote({ symbol });
    if (!quote?.price) {
      return { title: 'Stock not found' };
    }

    const change = quote.changesPercentage;
    const pos = (change ?? 0) >= 0;
    const direction = pos ? '▲' : '▼';

    return {
      title: `${symbol} ${quote.price.toFixed(2)} ${direction} ${
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

  const user = await getUser();
  const [stock, portfolios] = await Promise.all([
    getStock({ symbol }),
    getFullPortfoliosByUser(),
  ]);

  const peersList = await db.stock.findMany({
    select: {
      companyName: true,
      image: true,
      symbol: true,
    },
    where: {
      symbol: { in: stock?.peersList?.split(',') },
    },
  });

  if (!stock) {
    return notFound();
  }

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
              <SymbolItem fullLength size="sm" stock={stock} />
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
                  <SymbolItem fullLength size="sm" stock={peer} />
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
          <NewOrderModal portfolios={portfolios} stock={stock} />
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
