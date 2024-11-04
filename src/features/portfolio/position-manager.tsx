'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowBigDown,
  ArrowBigUp,
  CalendarPlus,
  ExternalLink,
  MoreVertical,
  Plus,
  Search,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { removePosition as removePositionFn } from '../order/actions/remove-position';
import { NewOrderModal } from '../order/new-order-modal';
import { POS_MANAGER_COLS } from './config/position-manager-cols';
import { PortfolioWithQuotes } from './types/portfolio';

const AddModal = dynamic(
  () => import('../order/add-modal').then((mod) => mod.AddModal),
  {
    ssr: false,
    loading: () => (
      <Button aria-label="Add orders" size="icon" variant="faded">
        <Plus size={18} />
      </Button>
    ),
  },
);

interface Props {
  portfolio: PortfolioWithQuotes;
  isOwner: boolean;
}

export const PositionManager = ({ portfolio, isOwner }: Readonly<Props>) => {
  const [filterValue, setFilterValue] = useState('');

  const router = useRouter();
  const { mutate: removePosition, isPending } = useMutation({
    mutationFn: removePositionFn,
    onError: () => toast.error('Failed to remove position.'),
    onSuccess: ({ error }) => {
      if (error) {
        return toast.error(error);
      }
      router.refresh();
    },
  });

  const filteredPositions = useMemo(() => {
    return portfolio.orders
      .filter(({ stock }) =>
        stock.companyName.toLowerCase().includes(filterValue.toLowerCase()),
      )
      .sort((a, b) => a.stock.companyName.localeCompare(b.stock.companyName));
  }, [portfolio.orders, filterValue]);

  return (
    <div className="f-col w-full p-6 xl:w-[500px] 2xl:w-[600px]">
      <div className="f-center justify-between">
        <div className="bg-faded f-center h-10 gap-1 rounded-full border px-1 pr-4">
          <Input
            placeholder="Search by company name..."
            value={filterValue}
            className="h-full border-none bg-inherit"
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <Search size={18} aria-label="Search" className="text-gray-400" />
        </div>
        {isOwner && <AddModal portfolio={portfolio} />}
      </div>

      <Table aria-label="Assets Table">
        <TableHeader>
          <TableRow>
            {POS_MANAGER_COLS.map((column) => (
              <TableHead key={column.key}>{column.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {filteredPositions?.map(({ stock, quantity, price, stockId }) => {
            const averagePrice = ((stock.price ?? 0) - price) * quantity;

            let availableQuantity = 0;
            for (const order of portfolio.orders) {
              if (order.stockId === stockId) {
                availableQuantity += order.quantity;
              }
            }

            return (
              <TableRow key={stock.symbol}>
                <TableCell>
                  <SymbolItem stock={stock} size="sm" />
                </TableCell>
                <TableCell className="text-sm">
                  <div className="f-col">
                    <p className="font-semibold">${stock.price?.toFixed(2)}</p>
                    <div className="flex">
                      <div className="f-center gap-[1px] text-[13px]">
                        {(stock.changesPercentage ?? 0) >= 0 ? (
                          <ArrowBigUp size={15} className="text-price-up" />
                        ) : (
                          <ArrowBigDown size={15} className="text-price-down" />
                        )}
                        <span
                          className={cn(
                            (stock.changesPercentage ?? 0) >= 0
                              ? 'text-price-up'
                              : 'text-price-down',
                          )}
                        >
                          {stock.changesPercentage?.toFixed(2).replace('-', '')}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="f-col">
                    <div className="flex gap-0.5 font-semibold">
                      {quantity}
                      <span className="ml-[1px] text-sm text-gray-400">
                        {quantity === 1 ? 'Share' : 'Shares'}
                      </span>
                      <span className="text-violet-400">@</span>
                      <p className="text-[13px]">${price.toFixed(2)}</p>
                    </div>
                    <div className="f-center gap-1 text-[13px]">
                      <span
                        className={cn(
                          averagePrice >= 0
                            ? 'text-price-up'
                            : 'text-price-down',
                        )}
                      >
                        {averagePrice >= 0 ? '+' : '-'}$
                        {averagePrice.toFixed(2).replace('-', '')}
                      </span>
                      <span className="text-gray-400">(P/L)</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="f-center relative justify-end gap-2">
                    <Dialog>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger disabled={isPending} asChild>
                          <Button
                            size="icon"
                            isLoading={isPending}
                            variant="ghost"
                            aria-label="Position Actions"
                          >
                            {!isPending && <MoreVertical size={18} />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Link href={`/stocks/${stock.symbol}`}>
                            <DropdownMenuItem className="gap-1.5">
                              <ExternalLink size={16} />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            <DialogTrigger asChild>
                              <div className="f-center gap-1.5">
                                <CalendarPlus size={16} />
                                New Order
                              </div>
                            </DialogTrigger>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-1.5 hover:bg-red-500/90"
                            onClick={() =>
                              removePosition({
                                portfolioId: portfolio.id,
                                stockId: stock.id,
                              })
                            }
                          >
                            <X size={16} />
                            Sell Position
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <NewOrderModal
                        portfolio={portfolio}
                        stock={stock}
                        availableQuantity={availableQuantity}
                      />
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          }) ?? (
            <TableRow className="text-sm text-gray-400">
              <TableCell colSpan={4}>No positions added yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
