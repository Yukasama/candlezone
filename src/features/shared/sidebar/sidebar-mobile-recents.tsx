import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import { User } from 'next-auth';
import Link from 'next/link';

interface Props {
  user?: User;
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
}

export const SidebarMobileRecents = ({ user, recentStocks }: Props) => {
  if (!user) {
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
            Sign in to view recent stocks
          </Link>
        </SheetClose>
      </div>
    );
  }

  if (recentStocks?.length === 0) {
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
        {recentStocks?.map((stock) => (
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
