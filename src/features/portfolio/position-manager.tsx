'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
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
import { useMemo, useState } from 'react';
import { NewOrderForm } from '../order/new-order-form';
import { SellPositionForm } from '../order/sell-position-form';
import { POS_MANAGER_COLS } from './config/position-manager-cols';
import { PortfolioWithQuotes } from './types/portfolio';

const AddModal = dynamic(
  () => import('../order/add-order-modal').then((mod) => mod.AddOrderModal),
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
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [sellPositionOpen, setSellPositionOpen] = useState(false);

  const filteredPositions = useMemo(() => {
    return portfolio.orders
      .filter(({ stock }) =>
        stock.companyName.toLowerCase().includes(filterValue.toLowerCase()),
      )
      .sort((a, b) => a.stock.companyName.localeCompare(b.stock.companyName));
  }, [portfolio.orders, filterValue]);

  const [selectedStock, setSelectedStock] = useState(
    filteredPositions[0]?.stock,
  );

  return (
    <div className="f-col w-full p-6 xl:w-[500px] 2xl:w-[600px]">
      <div className="f-center justify-between">
        <div className="bg-faded f-center h-10 gap-1 rounded-full border px-1 pr-4">
          <Input
            placeholder="Search by company name..."
            value={filterValue}
            className="h-full border-none bg-inherit"
            onChange={(e) => {
              setFilterValue(e.target.value);
            }}
          />
          <Search size={18} aria-label="Search" className="text-gray-400" />
        </div>
        {isOwner && <AddModal portfolio={portfolio} />}
      </div>

      <Table aria-label="Position Manager">
        <TableHeader>
          <TableRow>
            {POS_MANAGER_COLS.map(({ key, name }) => (
              <TableHead key={key}>{name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {filteredPositions.length > 0 ? (
            filteredPositions.map(({ stock, quantity, averagePrice }) => {
              return (
                <TableRow key={stock.symbol}>
                  <TableCell>
                    <SymbolItem stock={stock} size="sm" />
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="f-col">
                      <p className="font-semibold">
                        ${stock.price?.toFixed(2)}
                      </p>
                      <div className="flex">
                        <div className="f-center gap-[1px] text-[13px]">
                          {(stock.changesPercentage ?? 0) >= 0 ? (
                            <ArrowBigUp size={15} className="text-price-up" />
                          ) : (
                            <ArrowBigDown
                              size={15}
                              className="text-price-down"
                            />
                          )}
                          <span
                            className={cn(
                              (stock.changesPercentage ?? 0) >= 0
                                ? 'text-price-up'
                                : 'text-price-down',
                            )}
                          >
                            {stock.changesPercentage
                              ?.toFixed(2)
                              .replace('-', '')}
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
                        <p className="text-[13px]">
                          ${averagePrice?.toFixed(2)}
                        </p>
                      </div>
                      <div className="f-center gap-1 text-[13px]">
                        <span
                          className={cn(
                            ((stock.price ?? 0) - (averagePrice ?? 0)) *
                              (quantity ?? 0) >=
                              0
                              ? 'text-price-up'
                              : 'text-price-down',
                          )}
                        >
                          {((stock.price ?? 0) - (averagePrice ?? 0)) *
                            (quantity ?? 0) >=
                          0
                            ? '+'
                            : '-'}
                          $
                          {Math.abs(
                            ((stock.price ?? 0) - (averagePrice ?? 0)) *
                              (quantity ?? 0),
                          ).toFixed(2)}
                        </span>
                        <span className="text-gray-400">(P/L)</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="f-center relative justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Position actions"
                          >
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Link href={`/stocks/${stock.symbol}`}>
                            <DropdownMenuItem className="gap-1.5">
                              <ExternalLink size={16} />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStock(stock);
                              setNewOrderOpen(true);
                            }}
                          >
                            <div className="f-center gap-1.5">
                              <CalendarPlus size={16} />
                              New Order
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-1.5 hover:bg-red-500/90"
                            onClick={() => {
                              setSelectedStock(stock);
                              setSellPositionOpen(true);
                            }}
                          >
                            <X size={16} />
                            Sell Position
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        <ResponsiveDialog
                          open={newOrderOpen}
                          setOpen={setNewOrderOpen}
                          title="New Order"
                        >
                          <NewOrderForm
                            stock={selectedStock}
                            portfolios={[portfolio]}
                            setOpen={setNewOrderOpen}
                          />
                        </ResponsiveDialog>
                        <ResponsiveDialog
                          open={sellPositionOpen}
                          setOpen={setSellPositionOpen}
                          title="Sell Position"
                        >
                          <SellPositionForm
                            portfolioId={portfolio.id}
                            stock={stock}
                            quantity={quantity}
                            setOpen={setSellPositionOpen}
                          />
                        </ResponsiveDialog>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow className="text-sm text-gray-400">
              <TableCell colSpan={4}>No positions added yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
