'use client';

import { Loader } from '@/components/loader';
import { PageLayout } from '@/components/page-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddStockPortfolio } from '@/features/stock/add-stock-portfolio';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { ScreenerProps } from '@/lib/validators/stock';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, FileText, Layers, RotateCcw } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { queryStocks } from '../stock/actions/query-stocks';
import { SymbolItem } from '../stock/components/symbol-item';
import {
  countries,
  earningsDates,
  exchanges,
  industries,
  marketCaps,
  peRatios,
  pegRatios,
  sectors,
} from './config/filters';
import { SCREENER_TABLE_COLUMNS } from './config/screener-table-columns';

const DEFAULT_STATE = {
  exchange: 'Any',
  ticker: '',
  sector: 'Any',
  industry: 'Any',
  country: 'Any',
  earningsDate: 'Any',
  peRatio: ['Any', 'Any'] as [string, string],
  pegRatio: ['Any', 'Any'] as [string, string],
  mktCap: 'Any',
  sma50: ['Any', 'Any'] as [string, string],
};

interface Props {
  user?: User;
}

export const Screener = ({ user }: Props) => {
  const [resetCounter, setResetCounter] = useState(0);
  const [input, setInput] = useState<ScreenerProps>(DEFAULT_STATE);

  const router = useRouter();
  const searchParams = useSearchParams();

  const cursor =
    typeof searchParams.get('cursor') === 'string'
      ? Number(searchParams.get('cursor'))
      : 1;

  const takeParam =
    typeof searchParams.get('take') === 'string' &&
    Number(searchParams.get('take'));
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 10;

  const { data, isFetched } = useQuery({
    queryFn: async () => await queryStocks({ ...input, cursor, take }),
    queryKey: ['screener', input, cursor, take],
  });

  const resetFilters = () => {
    setInput(DEFAULT_STATE);
    setResetCounter((prev) => prev + 1);
    router.replace(`/screener?cursor=1&take=${take}`);
  };

  const updateFilter = (
    filterId: keyof typeof DEFAULT_STATE,
    newValue: string,
    i?: number,
  ) => {
    setInput((prev) => {
      if (i !== undefined && Array.isArray(prev[filterId])) {
        const updatedTuple = prev[filterId] as [string, string];
        updatedTuple[i] = newValue;
        return {
          ...prev,
          [filterId]: updatedTuple,
        };
      }
      return {
        ...prev,
        [filterId]: newValue,
      };
    });
  };

  const DESCRIPTIVE_FILTERS = [
    {
      id: 'exchange',
      label: 'Exchange',
      value: input.exchange,
      value2: undefined,
      options: exchanges,
      setOption: (value: string) => updateFilter('exchange', value),
    },
    {
      id: 'sector',
      label: 'Sector',
      value: input.sector,
      value2: undefined,
      options: sectors,
      setOption: (value: string) => updateFilter('sector', value),
    },
    {
      id: 'industry',
      label: 'Industry',
      value: input.industry,
      value2: undefined,
      options: industries,
      setOption: (value: string) => updateFilter('industry', value),
    },
    {
      id: 'country',
      label: 'Country',
      value: input.country,
      value2: undefined,
      options: countries,
      setOption: (value: string) => updateFilter('country', value),
    },
    {
      id: 'earningsDate',
      label: 'Earnings Date',
      value: input.earningsDate,
      value2: undefined,
      options: earningsDates,
      setOption: (value: string) => updateFilter('earningsDate', value),
    },
    {
      id: 'mktCap',
      label: 'Market Cap',
      value: input.mktCap,
      value2: undefined,
      options: marketCaps,
      setOption: (value: string) => updateFilter('mktCap', value),
    },
  ];

  const FUNDAMENTAL_FILTERS = [
    {
      id: 'peRatio',
      label: 'P/E Ratio',
      value: input.peRatio[0],
      value2: input.peRatio[1],
      options: peRatios,
      setOption: (value: string, i?: number) =>
        updateFilter('peRatio', value, i),
    },
    {
      id: 'pegRatio',
      label: 'PEG Ratio',
      value: input.pegRatio[0],
      value2: input.pegRatio[1],
      options: pegRatios,
      setOption: (value: string, i?: number) =>
        updateFilter('pegRatio', value, i),
    },
  ];

  const TECHNICAL_FILTERS = [
    {
      id: 'sma50',
      label: 'SMA 50',
      value: input.sma50[0],
      value2: input.sma50[1],
      options: ['-20%'],
      setOption: (value: string, i?: number) => updateFilter('sma50', value, i),
    },
  ];

  const CONFIG = [
    {
      id: 'descriptive',
      name: 'Descriptive',
      description: 'Filters that describe the stock',
      icon: <FileText size={18} />,
      filters: DESCRIPTIVE_FILTERS,
    },
    {
      id: 'fundamental',
      name: 'Fundamental',
      description: 'Filters based on financial statements',
      icon: <Layers size={18} />,
      filters: FUNDAMENTAL_FILTERS,
    },
    {
      id: 'technical',
      name: 'Technical',
      description: "Filters based on the stock's chart",
      icon: <BarChart2 size={18} />,
      filters: TECHNICAL_FILTERS,
    },
  ];

  return (
    <PageLayout className="gap-5">
      <Card className="f-col bg-faded relative gap-3 border p-4">
        <Tabs
          aria-label="Filters"
          className="md:f-col"
          defaultValue="descriptive"
        >
          <TabsList className="md:self-center">
            {CONFIG.map((entry) => (
              <TabsTrigger
                key={entry.id}
                value={entry.id}
                aria-label={entry.name}
                className="md:px-4"
              >
                {entry.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            size="icon"
            className="absolute right-4 top-4"
            aria-label="Reset filters"
            onClick={() => resetFilters()}
          >
            <RotateCcw size={18} />
          </Button>

          {CONFIG.map((entry) => (
            <TabsContent key={entry.id} value={entry.id}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {entry.filters.map((filter) => (
                  <div className="f-col" key={filter.id + resetCounter}>
                    {filter.value2 && (
                      <Select onValueChange={(e) => filter.setOption(e, 1)}>
                        <Label className="text-xs text-gray-400">
                          {filter.label}
                        </Label>
                        <SelectTrigger
                          aria-label={filter.label}
                          className="h-9"
                        >
                          <SelectValue placeholder="Any">
                            {filter.value2}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <p className="mb-2 text-xs text-gray-400">
                          {filter.value2 && 'Minimum Value'}
                        </p>
                      </Select>
                    )}
                    <Select
                      onValueChange={(e) => {
                        filter.setOption(e, filter.value2 ? 0 : undefined);
                      }}
                    >
                      <Label className="text-xs text-gray-400">
                        {filter.label}
                      </Label>
                      <SelectTrigger aria-label={filter.label} className="h-9">
                        <SelectValue placeholder="Any">
                          {filter.value}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <p className="text-xs text-gray-400">
                        {filter.value2 && 'Maximum Value'}
                      </p>
                    </Select>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {isFetched ? (
        data?.length ? (
          <Table aria-label="Screener Table">
            <TableHeader>
              <TableRow>
                {SCREENER_TABLE_COLUMNS.map((column) => (
                  <TableHead key={column.label}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((stock) => (
                <TableRow key={stock.symbol + 'screener'}>
                  <TableCell className="w-0">
                    <Link href={`/stocks/${stock.symbol}`}>
                      <AddStockPortfolio stock={stock} user={user} />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/stocks/${stock.symbol}`}>
                      <SymbolItem stock={stock} />
                    </Link>
                  </TableCell>
                  <TableCell>{formatMarketCap(stock.mktCap!)}</TableCell>
                  <TableCell className="font-semibold">
                    <Badge variant="secondary">{stock.sector}</Badge>
                  </TableCell>
                  <TableCell>{stock.country}</TableCell>
                  <TableCell>{stock.peRatioTTM?.toFixed(2) ?? 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="mt-10 self-center text-sm text-gray-400">
            No results found.
          </p>
        )
      ) : (
        <Loader className="mt-10 self-center" />
      )}

      <Pagination>
        <PaginationContent className="mt-2 self-center" aria-label="Pagination">
          <PaginationItem>
            <PaginationPrevious
              href={`/screener?cursor=${cursor >= 1 ? 1 : cursor - 1}&take=${take}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`/screener?cursor=${cursor + 1}&take=${take}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </PageLayout>
  );
};
