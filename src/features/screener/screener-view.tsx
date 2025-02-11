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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Suspense, useState } from 'react';
import { PortfolioWithQuotes } from '../portfolio/types/portfolio';
import { SCREENER_TABS } from './config/screener-tabs';
import { getFiltersFromSearchParams } from './lib/get-filters';
import { ScreenerActions } from './screener-actions';
import { ScreenerResults } from './screener-results';
import { TabsType } from './types/screener';

interface Props {
  portfolios?: PortfolioWithQuotes[];
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

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="motion-preset-slide-down-md flex h-9 items-center gap-1 rounded-full border px-1 pr-4">
          <Input
            className="h-full w-40 border-none text-base placeholder:mt-[1px] xl:w-52"
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Search..."
            value={symbol}
          />
          <Search aria-label="Search" className="text-desc" size={18} />
        </div>
        <Suspense>
          <ScreenerActions />
        </Suspense>
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
              <Badge
                className="flex items-center gap-1"
                key={key}
                variant="secondary"
              >
                {`${key}: ${String(value)}`}
                <Button
                  aria-label="Remove filter"
                  className="flex size-4 items-center justify-center"
                  onClick={() => {
                    const params = new URLSearchParams(String(searchParams));
                    params.delete(key);
                    router.replace(`/screener?${String(params)}`);
                  }}
                  size="small-icon"
                  variant="ghost"
                >
                  <X className="size-3.5" />
                </Button>
              </Badge>
            );
          }
        })}
      </div>

      <Tabs onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="bg-background w-full rounded-none px-0">
          {SCREENER_TABS.map((tab) => (
            <TabsTrigger
              className="flex-1 rounded-none data-[state=active]:border-b-2"
              key={tab}
              value={tab.toLowerCase()}
            >
              {`${tab[0].toUpperCase()}${tab.slice(1)}`}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent className="w-full overflow-x-auto" value={activeTab}>
          <ScreenerResults
            cursor={cursor}
            filters={filters}
            portfolios={portfolios}
            symbol={symbol}
            tab={activeTab}
            take={take}
          />
        </TabsContent>
      </Tabs>

      <Pagination>
        <PaginationContent aria-label="Pagination" className="mt-2 self-center">
          <PaginationItem>
            <PaginationPrevious
              className={cn(cursor === 1 && 'pointer-events-none')}
              href={`/screener?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                cursor: Math.max(cursor - 1, 1).toString(),
                tab: activeTab,
                take: take.toString(),
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
                tab: activeTab,
                take: take.toString(),
              }).toString()}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
