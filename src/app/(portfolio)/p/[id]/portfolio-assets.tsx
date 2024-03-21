"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  Search,
  MoreVertical,
  ArrowBigUp,
  ArrowBigDown,
  ExternalLink,
  Trash2,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { StockQuote } from "@/types/stock";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PortfolioAddModal from "@/components/portfolio/portfolio-add-modal";
import { PortfolioWithStocks } from "@/types/db";
import SymbolItem from "@/components/stock/symbol-item";

interface Props {
  stockQuotes: Pick<
    StockQuote,
    | "id"
    | "symbol"
    | "companyName"
    | "image"
    | "sector"
    | "price"
    | "changesPercentage"
  >[];
  portfolio: Pick<PortfolioWithStocks, "id" | "title" | "stocks">;
}

const columnTranslation: any = {
  symbol: "Symbol",
  price: "Price (24h)",
  sector: "Sector",
  actions: "Actions",
};

export default function PortfolioAssets({ stockQuotes, portfolio }: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const ROWS_PER_PAGE = 5;
  const COLUMNS = ["symbol", "price", "sector", "actions"];

  const { mutate: remove, isLoading } = trpc.portfolio.remove.useMutation({
    onError: () => toast.error("Failed to remove position."),
    onSuccess: () => router.refresh(),
  });

  // Filtering and sorting stocks
  const filteredStocks = useMemo(() => {
    return stockQuotes
      .filter((stock) =>
        stock.companyName.toLowerCase().includes(filterValue.toLowerCase())
      )
      .sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, [stockQuotes, filterValue]);

  // Slicing stocks for pagination
  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return filteredStocks.slice(start, end);
  }, [filteredStocks, page, ROWS_PER_PAGE]);

  // Single cell for assets table
  const renderCell = (stock: any, columnKey: string) => {
    switch (columnKey) {
      case "symbol":
        return <SymbolItem stock={stock} />;
      case "price":
        return (
          <div className="f-col">
            <p className="font-semibold">${stock.price?.toFixed(2)}</p>
            <div className="text-[13px] flex items-center gap-[1px]">
              {stock.changesPercentage > 0 ? (
                <ArrowBigUp size={15} className="text-price-up" />
              ) : (
                <ArrowBigDown size={15} className="text-price-down" />
              )}
              <span
                className={`${
                  stock.changesPercentage > 0
                    ? "text-price-up"
                    : "text-price-down"
                }`}>
                {stock.changesPercentage?.toFixed(2).replace("-", "")}%
              </span>
            </div>
          </div>
        );
      case "sector":
        return (
          <Chip color="primary" size="sm">
            {stock[columnKey]}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger disabled={isLoading}>
                <Button
                  size="sm"
                  isLoading={isLoading}
                  isIconOnly
                  variant="flat"
                  aria-label="Actions">
                  {!isLoading && <MoreVertical size={18} />}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  aria-label="View stock"
                  onClick={() => router.push(`/stocks/${stock.symbol}`)}>
                  <div className="flex items-center gap-1.5">
                    <ExternalLink size={16} />
                    View
                  </div>
                </DropdownItem>
                <DropdownItem color="primary" aria-label="Edit position">
                  <div className="flex items-center gap-1.5">
                    <Pencil size={16} />
                    Edit
                  </div>
                </DropdownItem>
                <DropdownItem
                  aria-label="Remove stock"
                  color="danger"
                  onClick={() =>
                    remove({
                      portfolioId: portfolio.id,
                      stockIds: [stock.id],
                    })
                  }>
                  {isLoading && <Spinner size="sm" />}
                  <div className="flex items-center gap-1.5">
                    <Trash2 size={16} />
                    Delete
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

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
            onChange={(e) => setFilterValue(e.target.value)}></Input>
        </div>
        <PortfolioAddModal portfolio={portfolio} />
      </div>

      {/* Assets Table */}
      <Table aria-label="Assets Table">
        <TableHeader>
          {COLUMNS.map((column) => (
            <TableColumn key={column}>{columnTranslation[column]}</TableColumn>
          ))}
        </TableHeader>
        <TableBody isLoading={isLoading}>
          {paginatedStocks.map((stock) => (
            <TableRow key={stock.id}>
              {COLUMNS.map((column) => (
                <TableCell key={column}>{renderCell(stock, column)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Control for Table */}
      <Pagination
        className="mt-2 self-center"
        total={Math.ceil(filteredStocks.length / ROWS_PER_PAGE)}
        page={page}
        onChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
