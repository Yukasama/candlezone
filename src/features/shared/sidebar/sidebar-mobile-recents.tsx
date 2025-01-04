import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { getRecentStocks } from '@/features/stock/lib/get-recent-stocks';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const SidebarMobileRecents = async () => {
  const recentStocks = await getRecentStocks({ take: 7 });

  if (!recentStocks || recentStocks.length === 0) {
    return (
      <div className="f-col gap-2">
        <p className="ml-0.5 text-sm font-medium text-gray-500">
          RECENT STOCKS
        </p>
        <SheetClose asChild>
          <Link
            href="/sign-in"
            className="text-sm text-gray-400 hover:underline"
          >
            Sign in to save viewed stocks
          </Link>
        </SheetClose>
      </div>
    );
  }

  if (recentStocks.length === 0) {
    return (
      <div className="f-col gap-2">
        <p className="ml-0.5 text-sm font-medium text-gray-500">
          RECENT STOCKS
        </p>
        <div className="text-sm text-gray-400">
          Stocks you viewed will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="f-col gap-2">
      <p className="ml-0.5 text-sm font-medium text-gray-500">RECENT STOCKS</p>
      <div className="f-col gap-1">
        {recentStocks.map((stock) => (
          <SheetClose key={stock.symbol} asChild>
            <Link
              href={`/stocks/${stock.symbol}`}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'lg' }),
                'justify-start gap-2 p-1.5 px-2',
              )}
            >
              <SymbolItem stock={stock} size="sm" fullLength />
            </Link>
          </SheetClose>
        ))}
      </div>
    </div>
  );
};
