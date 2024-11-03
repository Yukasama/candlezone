'use client';

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
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PortfolioWithQuotes } from '../portfolio/types/portfolio';
import { queryStocks } from '../stock/actions/query-stocks';
import { getFiltersFromSearchParams } from './config/filters';
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
  const [activeTab, setActiveTab] = useState<TabsType>('general');

  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = getFiltersFromSearchParams(searchParams);
  const cursor = filters.cursor ?? 1;
  const takeParam = filters.take;
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 11;

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => queryStocks({ ...filters, cursor, take, symbol }),
    queryKey: ['screener', filters, cursor, take, symbol],
  });

  useEffect(() => {
    const tab = searchParams.get('tab') as TabsType;
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams([...searchParams.entries()]);
    params.set('tab', value);
    router.replace(`/screener?${params.toString()}`);
  };

  const screenerTabs = [
    'General',
    'Valuation',
    'Performance',
    'Financials',
    'Insiders',
  ];

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        defaultValue="general"
        onValueChange={handleTabChange}
        className="overflow-x-hidden"
      >
        <div className="f-center mb-3 justify-between">
          <div className="bg-faded f-center h-9 gap-1 rounded-full border px-1 pr-4">
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
        <TabsList className="w-full rounded-none bg-background px-0">
          {screenerTabs.map((tab) => (
            <TabsTrigger
              key={tab}
              className="flex-1 rounded-none data-[state=active]:border-b-2"
              value={tab.toLowerCase()}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="w-full overflow-x-auto">
          {(data?.length ?? 0) > 0 ? (
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
