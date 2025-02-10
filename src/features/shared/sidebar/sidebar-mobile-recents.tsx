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
          <Link className="text-desc text-sm hover:underline" href="/sign-in">
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
          <SheetClose asChild key={stock.symbol}>
            <Link
              className={cn(
                buttonVariants({ size: 'lg', variant: 'ghost' }),
                'justify-start gap-2 p-1.5 px-2',
              )}
              href={`/stocks/${stock.symbol}`}
            >
              <SymbolItem fullLength size="sm" stock={stock} />
            </Link>
          </SheetClose>
        ))}
      </div>
    </div>
  );
};
