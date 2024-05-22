'use client'

import { useState, useMemo } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Search,
  MoreVertical,
  ArrowBigUp,
  ArrowBigDown,
  ExternalLink,
  Trash2,
  Pencil,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PortfolioAddModal } from '@/components/portfolio/portfolio-add-modal'
import { PortfolioWithStocks } from '@/types/portfolio'
import { SymbolItem } from '@/components/stock/symbol-item'
import { useMutation } from '@tanstack/react-query'
import { removePortfolioPosition } from '@/actions/portfolio/remove-portfolio-position'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StockQuote } from '@/types/stock'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  stockQuotes: StockQuote[]
  portfolio: Pick<PortfolioWithStocks, 'id' | 'title' | 'stocks'>
  isOwner: boolean
}

export const PortfolioAssets = ({
  stockQuotes,
  portfolio,
  isOwner,
}: Readonly<Props>) => {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)

  const router = useRouter()

  const ROWS_PER_PAGE = 5
  const COLUMNS = [
    { key: 'symbol', name: 'Name', allowsSorting: true },
    { key: 'price', name: 'Price' },
    { key: 'sector', name: 'Sector', allowsSorting: true },
    { key: 'actions', name: '' },
  ]

  const { mutate: remove, isPending } = useMutation({
    mutationFn: removePortfolioPosition,
    onError: () => toast.error('Failed to remove position.'),
    onSuccess: () => router.refresh(),
  })

  // Filtering and sorting stocks
  const filteredStocks = useMemo(() => {
    return stockQuotes
      .filter((stock) =>
        stock.companyName.toLowerCase().includes(filterValue.toLowerCase())
      )
      .sort((a, b) => a.companyName.localeCompare(b.companyName))
  }, [stockQuotes, filterValue])

  // Slicing stocks for pagination
  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    const end = start + ROWS_PER_PAGE
    return filteredStocks.slice(start, end)
  }, [filteredStocks, page, ROWS_PER_PAGE])

  return (
    <div className="f-col w-full max-w-[800px]">
      {/* Operations Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Search size={18} aria-label="Search" />
          <Input
            type="text"
            placeholder="Search by company name..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        {isOwner && <PortfolioAddModal portfolio={portfolio} />}
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
                />
              </TableCell>
              <TableCell className="text-sm">
                <div className="f-col">
                  <p className="font-semibold">${stock.price?.toFixed(2)}</p>
                  <div className="text-[13px] flex items-center gap-[1px]">
                    {(stock.changesPercentage ?? 0) >= 0 ? (
                      <ArrowBigUp size={15} className="text-price-up" />
                    ) : (
                      <ArrowBigDown size={15} className="text-price-down" />
                    )}
                    <span
                      className={`${
                        (stock.changesPercentage ?? 0) >= 0
                          ? 'text-price-up'
                          : 'text-price-down'
                      }`}
                    >
                      {stock.changesPercentage?.toFixed(2).replace('-', '')}%
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{stock.sector}</Badge>
              </TableCell>
              <TableCell>
                <div className="relative flex justify-end items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger disabled={isPending} asChild>
                      <Button
                        size="icon"
                        isLoading={isPending}
                        variant="secondary"
                        aria-label="Position Action"
                      >
                        {!isPending && <MoreVertical size={18} />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-faded">
                      <DropdownMenuItem
                        aria-label="View stock"
                        onClick={() => router.push(`/stocks/${stock.symbol}`)}
                      >
                        <div className="flex items-center gap-1.5">
                          <ExternalLink size={16} />
                          View
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        color="primary"
                        aria-label="Edit position"
                      >
                        <div className="flex items-center gap-1.5">
                          <Pencil size={16} />
                          Edit
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        aria-label="Remove stock"
                        color="danger"
                        onClick={() =>
                          remove({
                            portfolioId: portfolio.id,
                            positions: [{ stockId: stock.id }],
                          })
                        }
                      >
                        {isPending && <Loader size={32} />}
                        <div className="flex items-center gap-1.5">
                          <Trash2 size={16} />
                          Delete
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
