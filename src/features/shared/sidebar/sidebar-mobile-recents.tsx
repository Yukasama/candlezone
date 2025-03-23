import { SheetClose } from '@/components/ui/sheet';
import { getUser } from '@/features/auth/actions/get-user';
import { getRecentStocks } from '@/features/stock/actions/get-recent-stocks';
import { StockCard } from '@/features/stock/components/stock-card';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import Link from 'next/link';

export const SidebarMobileRecents = async () => {
  const [user, recentStocks] = await Promise.all([
    getUser(),
    getRecentStocks({}),
  ]);

  const stockQuotes = await getStockQuotes(recentStocks);

  if (!user) {
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
        {stockQuotes.map((stock) => (
          <SheetClose asChild key={stock.symbol}>
            <StockCard
              asLink
              className="mr-auto min-w-[98%] rounded-full"
              showPrice
              stock={stock}
              width={230}
            />
          </SheetClose>
        ))}
      </div>
    </div>
  );
};
