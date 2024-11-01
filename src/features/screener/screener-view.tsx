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
import { User } from 'next-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
  user?: User;
}

export const ScreenerView = ({ portfolios, user }: Props) => {
  const [input, setInput] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = (searchParams.get('tab') ?? 'general') as TabsType;
  const filters = getFiltersFromSearchParams(searchParams);

  const cursor = filters.cursor ?? 1;
  const takeParam = filters.take;
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 11;

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => queryStocks({ ...filters, cursor, take, ticker: input }),
    queryKey: ['screener', filters, cursor, take, input],
  });

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams([...searchParams.entries()]);
    params.set('tab', value);
    router.replace(`/screener?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="overflow-x-hidden"
      >
        <div className="f-center mb-3 justify-between">
          <div className="bg-faded f-center h-9 gap-1 rounded-full border px-1 pr-4">
            <Input
              placeholder="Search..."
              value={input}
              className="h-full w-48 border-none bg-inherit xl:w-60"
              onChange={(e) => setInput(e.target.value)}
            />
            <Search size={18} aria-label="Search" className="text-gray-400" />
          </div>
          <ScreenerActions />
        </div>
        <TabsList className="w-full rounded-none bg-background px-0">
          <TabsTrigger
            className="flex-1 rounded-none data-[state=active]:border-b-2"
            value="general"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 rounded-none data-[state=active]:border-b-2"
            value="valuation"
          >
            Valuation
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 rounded-none data-[state=active]:border-b-2"
            value="performance"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 rounded-none data-[state=active]:border-b-2"
            value="financials"
          >
            Financials
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 rounded-none data-[state=active]:border-b-2"
            value="insiders"
          >
            Insiders
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="w-full overflow-x-auto">
          {(data?.length ?? 0) > 0 ? (
            <ScreenerTable
              data={data}
              portfolios={portfolios}
              user={user}
              tab={activeTab}
            />
          ) : isFetching || isLoading ? (
            [11].map((_, i) => (
              <Skeleton className="my-1.5 h-14 w-full" key={i} />
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
