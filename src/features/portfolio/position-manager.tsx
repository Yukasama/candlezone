'use client'

import { removePosition as removePositionFn } from '@/actions/portfolio/order/remove-position'
import { SymbolItem } from '@/components/stock/symbol-item'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { PortfolioWithQuotes } from '@/types/portfolio'
import { useMutation } from '@tanstack/react-query'
import {
  ArrowBigDown,
  ArrowBigUp,
  ExternalLink,
  MoreVertical,
  Pencil,
  Search,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AddModal } from './add-modal'
import { EditOrder } from './edit-order-popover'

interface Props {
  portfolio: PortfolioWithQuotes
  isOwner: boolean
}

export const PositionManager = ({ portfolio, isOwner }: Readonly<Props>) => {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)

  const router = useRouter()

  const ROWS_PER_PAGE = 5
  const COLUMNS = [
    { key: 'symbol', name: 'Name', allowsSorting: true },
    { key: 'price', name: 'Price' },
    { key: 'quantity', name: 'Quantity' },
    { key: 'actions', name: '' },
  ]

  const { mutate: removePosition, isPending } = useMutation({
    mutationFn: removePositionFn,
    onError: () => toast.error('Failed to remove position.'),
    onSuccess: () => router.refresh(),
  })

  const paginatedStocks = useMemo(() => {
    const filtered = portfolio.orders
      .filter((stock) =>
        stock.companyName.toLowerCase().includes(filterValue.toLowerCase()),
      )
      .sort((a, b) => a.companyName.localeCompare(b.companyName))

    const start = (page - 1) * ROWS_PER_PAGE
    const end = start + ROWS_PER_PAGE
    return filtered.slice(start, end)
  }, [portfolio.orders, filterValue, page, ROWS_PER_PAGE])

  return (
    <div className="f-col w-full p-6 xl:w-[450px] 2xl:w-[550px]">
      <div className="f-center justify-between">
        <div className="bg-faded f-center rounded-md pr-3">
          <Input
            type="text"
            placeholder="Search by company name..."
            value={filterValue}
            className="border-none bg-inherit"
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <Search size={18} aria-label="Search" />
        </div>
        {isOwner && <AddModal portfolio={portfolio} />}
      </div>

      <Table aria-label="Assets Table">
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column.key}>{column.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {paginatedStocks?.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell>
                <SymbolItem
                  stock={{
                    symbol: stock.symbol,
                    companyName: stock.companyName,
                    image: stock.image,
                  }}
                  size="sm"
                />
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
                        {stock.changesPercentage?.toFixed(2).replace('-', '')}%
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="f-col">
                  <div className="flex gap-1 font-semibold">
                    {stock.quantity}
                    <span className="text-sm text-gray-400">
                      {stock.quantity === 1 ? 'Share' : 'Shares'}
                    </span>
                  </div>
                  <div className="f-center text-[13px]">
                    <span
                      className={cn(
                        (stock.changesPercentage ?? 0) >= 0
                          ? 'text-price-up'
                          : 'text-price-down',
                      )}
                    >
                      {(stock.changesPercentage ?? 0) >= 0 ? '+' : '-'}$
                      {(
                        (stock.quantity *
                          stock.price *
                          (stock.changesPercentage ?? 0)) /
                        100
                      )
                        .toFixed(2)
                        .replace('-', '')}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="f-center relative justify-end gap-2">
                  <Popover>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger disabled={isPending} asChild>
                        <Button
                          size="icon"
                          isLoading={isPending}
                          variant="secondary"
                          aria-label="Action"
                        >
                          {!isPending && <MoreVertical size={18} />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-faded">
                        <Link href={`/stocks/${stock.symbol}`}>
                          <DropdownMenuItem className="gap-1.5">
                            <ExternalLink size={16} />
                            View
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="gap-1.5">
                          <PopoverTrigger asChild>
                            <>
                              <Pencil size={16} />
                              Edit
                            </>
                          </PopoverTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-1.5"
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
                    <EditOrder order={stock} />
                  </Popover>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent className="mt-2 self-center" aria-label="Pagination">
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => setPage(page - 1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
