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
import { StockCard } from '@/features/stock/components/stock-card';
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
    loading: () => (
      <Button aria-label="Add orders" size="icon" variant="faded">
        <Plus size={18} />
      </Button>
    ),
    ssr: false,
  },
);

interface Props {
  isOwner: boolean;
  portfolio: PortfolioWithQuotes;
}

export const PositionManager = ({ isOwner, portfolio }: Readonly<Props>) => {
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
    <div className="flex w-full flex-col p-6 xl:w-[500px] 2xl:w-[600px]">
      <div className="flex items-center justify-between">
        <div className="bg-faded flex h-10 items-center gap-1 rounded-full border px-1 pr-4">
          <Input
            className="h-full border-none bg-inherit"
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Search by company name..."
            value={filterValue}
          />
          <Search aria-label="Search" className="text-desc" size={18} />
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
            filteredPositions.map(({ averagePrice, quantity, stock }) => {
              return (
                <TableRow key={stock.symbol}>
                  <TableCell>
                    <StockCard stock={stock} />
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <p className="font-semibold">
                        ${stock.price?.toFixed(2)}
                      </p>
                      <div className="flex">
                        <div className="flex items-center gap-[1px] text-[13px]">
                          {(stock.changesPercentage ?? 0) >= 0 ? (
                            <ArrowBigUp className="text-price-up" size={15} />
                          ) : (
                            <ArrowBigDown
                              className="text-price-down"
                              size={15}
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
                    <div className="flex flex-col">
                      <div className="flex gap-0.5 font-semibold">
                        {quantity}
                        <span className="text-desc ml-[1px] text-sm">
                          {quantity === 1 ? 'Share' : 'Shares'}
                        </span>
                        <span>@</span>
                        <p className="text-[13px]">
                          ${averagePrice?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[13px]">
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
                        <span className="text-desc">(P/L)</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-label="Position actions"
                            size="icon"
                            variant="ghost"
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
                          {isOwner && (
                            <>
                              <DropdownMenuItem
                                className="gap-1.5"
                                onClick={() => {
                                  setSelectedStock(stock);
                                  setNewOrderOpen(true);
                                }}
                              >
                                <CalendarPlus size={16} />
                                New Order
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-destructive gap-1.5"
                                onClick={() => {
                                  setSelectedStock(stock);
                                  setSellPositionOpen(true);
                                }}
                              >
                                <X size={16} />
                                Sell Position
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                        {isOwner && (
                          <>
                            <ResponsiveDialog
                              open={newOrderOpen}
                              setOpen={setNewOrderOpen}
                              title="New Order"
                            >
                              <NewOrderForm
                                portfolios={[portfolio]}
                                setOpen={setNewOrderOpen}
                                stock={{
                                  ...selectedStock,
                                  image: selectedStock.image ?? '',
                                  range: selectedStock.range ?? '',
                                }}
                              />
                            </ResponsiveDialog>
                            <ResponsiveDialog
                              open={sellPositionOpen}
                              setOpen={setSellPositionOpen}
                              title="Sell Position"
                            >
                              <SellPositionForm
                                portfolioId={portfolio.id}
                                quantity={
                                  filteredPositions.find(
                                    (p) => p.stockId === selectedStock.id,
                                  )?.quantity
                                }
                                setOpen={setSellPositionOpen}
                                stock={selectedStock}
                              />
                            </ResponsiveDialog>
                          </>
                        )}
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow className="text-desc text-sm">
              <TableCell colSpan={4}>No positions added yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
