'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { PortfolioWithQuotes } from '../portfolio/types/portfolio';
import { queryStocks } from './actions/query-stocks';
import { getFiltersFromSearchParams } from './config/filters';
import { SCREENER_TABS } from './config/screener-tabs';
import { ScreenerActions } from './screener-actions';
import { ScreenerTable } from './screener-table';
import { TabsType } from './types/screener';

interface Props {
  portfolios?: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[];
}

export const ScreenerView = ({ portfolios }: Props) => {
  const [symbol, setSymbol] = useState('');
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'general',
    parse: (value): TabsType =>
      SCREENER_TABS.includes(value as TabsType)
        ? (value as TabsType)
        : 'general',
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = getFiltersFromSearchParams(searchParams);
  const cursorParam = filters.cursor;
  const cursor = cursorParam && cursorParam >= 1 ? cursorParam : 1;
  const takeParam = filters.take;
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 11;

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => queryStocks({ ...filters, cursor, take, symbol }),
    queryKey: ['screener', filters, cursor, take, symbol],
  });

  return (
    <div className="w-full">
      <div className="f-center mb-3 justify-between">
        <div className="bg-faded f-center motion-preset-slide-down-md h-9 gap-1 rounded-full border px-1 pr-4">
          <Input
            placeholder="Search..."
            value={symbol}
            className="h-full w-48 border-none bg-inherit xl:w-60"
            onChange={(e) => setSymbol(e.target.value)}
          />
          <Search size={18} aria-label="Search" className="text-gray-400" />
        </div>
        <ScreenerActions />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (
            value &&
            key !== 'cursor' &&
            key !== 'take' &&
            key !== 'tab' &&
            key !== 'symbol'
          ) {
            return (
              <Badge key={key} variant="secondary" className="f-center gap-1">
                {`${key}: ${value}`}
                <Button
                  variant="ghost"
                  size="small-icon"
                  className="f-box size-4"
                  aria-label="Remove filter"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete(key);
                    router.replace(`/screener?${params.toString()}`);
                  }}
                >
                  <X className="size-3.5" />
                </Button>
              </Badge>
            );
          }
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full rounded-none bg-background px-0">
          {SCREENER_TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              className="flex-1 rounded-none data-[state=active]:border-b-2"
              value={tab.toLowerCase()}
            >
              {tab.at(0)?.toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="w-full overflow-x-auto">
          {data && (data?.length ?? 0) > 0 ? (
            <ScreenerTable
              data={data}
              portfolios={portfolios}
              tab={activeTab}
            />
          ) : isFetching || isLoading ? (
            Array.from({ length: 11 }, (_, i) => (
              <Skeleton className="my-1.5 h-14 w-full" key={`skeleton-${i}`} />
            ))
          ) : (
            <div className="f-col mx-auto mt-10 w-72 text-center">
              <h3 className="text-lg font-medium">No results found.</h3>
              <p className="text-center text-sm text-gray-400">
                We couldn&apos;t find what you&apos;re looking for. Try
                adjusting your search terms or filters.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Pagination>
        <PaginationContent className="mt-2 self-center" aria-label="Pagination">
          <PaginationItem>
            <PaginationPrevious
              className={cn(cursor === 1 && 'pointer-events-none')}
              href={`/screener?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                cursor: Math.max(cursor - 1, 1).toString(),
                take: take.toString(),
                tab: activeTab,
              }).toString()}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`/screener?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                cursor: (cursor + 1).toString(),
                take: take.toString(),
                tab: activeTab,
              }).toString()}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
