import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { getRecentStocks } from '@/features/stock/actions/get-recent-stocks';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const SidebarMobileRecents = async () => {
  const recentStocks = await getRecentStocks({});

  if (!recentStocks || recentStocks.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-desc ml-0.5 text-sm font-medium">RECENT STOCKS</p>
        <SheetClose asChild>
          <Link href="/sign-in" className="text-desc text-sm hover:underline">
            Sign in to save viewed stocks
          </Link>
        </SheetClose>
      </div>
    );
  }

  if (recentStocks.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-desc ml-0.5 text-sm font-medium">RECENT STOCKS</p>
        <div className="text-desc text-sm">
          Stocks you viewed will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-desc ml-0.5 text-sm font-medium">RECENT STOCKS</p>
      <div className="flex flex-col gap-1">
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
