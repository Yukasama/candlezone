'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useRef, useState } from 'react';
import { BubbleStock } from './actions/get-bubble-data';
import { regionMap } from './config/region-map';
import {
  formatParameterValue,
  getBubblePosition,
  getParameterLabel,
} from './lib/bubble-helpers';
import { StockBubble } from './stock-bubble';
import {
  AssetsFilter,
  RegionFilter,
  XAxisParameter,
} from './types/bubblechart';

interface Props {
  stocks: BubbleStock[];
}

export const StockBubbleChart = ({ stocks }: Props) => {
  const [parameter, setParameter] = useState<XAxisParameter>('marketCap');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [assetsFilter, setAssetsFilter] = useState<AssetsFilter>('all');
  const [hoveredStock, setHoveredStock] = useState<string | undefined>();
  const chartRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  // Handle parameter restrictions when asset type changes
  useEffect(() => {
    // If current parameter isn't available for selected asset type, switch to marketCap
    if (
      assetsFilter !== 'all' &&
      assetsFilter !== 'stocks' &&
      (parameter === 'priceToEarningsRatioTTM' ||
        parameter === 'netProfitMarginTTM')
    ) {
      setParameter('marketCap');
    }
  }, [assetsFilter, parameter]);

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setDimensions({
          height: chartRef.current.clientHeight,
          width: chartRef.current.clientWidth,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle asset filter change
  const handleAssetFilterChange = (value: string) => {
    const newFilter = value as AssetsFilter;
    setAssetsFilter(newFilter);

    // Reset region filter to 'all' if crypto or commodity is selected
    if (newFilter === 'crypto' || newFilter === 'commodities') {
      setRegionFilter('all');
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    // First filter by asset type
    if (assetsFilter !== 'all') {
      if (assetsFilter === 'stocks' && stock.type !== 'stock') {
        return false;
      }
      if (assetsFilter === 'indexes' && stock.type !== 'index') {
        return false;
      }
      if (assetsFilter === 'commodities' && stock.type !== 'commodity') {
        return false;
      }
      if (assetsFilter === 'crypto' && stock.type !== 'crypto') {
        return false;
      }
    }

    // Then filter by region (only if not filtering by crypto/commodities)
    if (
      regionFilter !== 'all' &&
      assetsFilter !== 'crypto' &&
      assetsFilter !== 'commodities'
    ) {
      const stockRegion = regionMap[stock.country ?? ''] || 'unknown';
      return stockRegion === regionFilter;
    }

    return true;
  });

  const parameterValues = filteredStocks.map((stock) => {
    switch (parameter) {
      case 'marketCap': {
        return stock.marketCap ?? 0;
      }
      case 'netProfitMarginTTM': {
        return stock.netProfitMarginTTM ?? 0;
      }
      case 'priceToEarningsRatioTTM': {
        return stock.priceToEarningsRatioTTM ?? 0;
      }
    }
  });

  const minValue = Math.min(...parameterValues.filter((v) => v > 0));
  const maxValue = Math.max(...parameterValues);
  const displayMaxChangePct = 10;

  // Calculate if region filter should be disabled
  const isRegionFilterDisabled =
    assetsFilter === 'crypto' || assetsFilter === 'commodities';

  return (
    <div className="w-full space-y-2 lg:h-full">
      <div className="flex flex-wrap gap-2">
        <Tabs
          onValueChange={(v) => setRegionFilter(v as RegionFilter)}
          value={regionFilter}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger disabled={isRegionFilterDisabled} value="america">
              America
            </TabsTrigger>
            <TabsTrigger disabled={isRegionFilterDisabled} value="europe">
              Europe
            </TabsTrigger>
            <TabsTrigger disabled={isRegionFilterDisabled} value="asia">
              Asia
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs onValueChange={handleAssetFilterChange} value={assetsFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="indexes">Indexes</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select
          onValueChange={(v) => setParameter(v as XAxisParameter)}
          value={parameter}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Parameter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="marketCap">Market Cap</SelectItem>
            <SelectItem
              disabled={assetsFilter !== 'all' && assetsFilter !== 'stocks'}
              value="priceToEarningsRatioTTM"
            >
              P/E Ratio
            </SelectItem>
            <SelectItem
              disabled={assetsFilter !== 'all' && assetsFilter !== 'stocks'}
              value="netProfitMarginTTM"
            >
              Profit Margin
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative h-[690px] w-full" ref={chartRef}>
        <div className="absolute top-0 right-0 left-0 flex justify-between">
          <div className="bg-background/80 rounded-md px-2 py-1 font-semibold lg:text-lg">
            {formatParameterValue(parameter, minValue)}
          </div>
          <div className="bg-background/80 text-desc rounded-md px-3 py-1 text-sm font-semibold lg:text-base">
            {getParameterLabel(parameter)}
          </div>
          <div className="bg-background/80 rounded-md px-2 py-1 font-semibold lg:text-lg">
            {formatParameterValue(parameter, maxValue)}
          </div>
        </div>

        <div className="border-muted-foreground/30 absolute top-1/2 right-5 left-5 border-t border-dashed" />

        {dimensions.width > 0 &&
          filteredStocks.map((stock) => {
            const position = getBubblePosition(
              stock,
              parameter,
              dimensions,
              minValue,
              maxValue,
              displayMaxChangePct,
            );

            const isOtherHovered =
              hoveredStock !== undefined && hoveredStock !== stock.symbol;

            return (
              <StockBubble
                isHovered={hoveredStock === stock.symbol}
                isOtherHovered={isOtherHovered}
                key={stock.symbol}
                position={position}
                setHoveredStock={setHoveredStock}
                stock={stock}
              />
            );
          })}
      </div>
    </div>
  );
};
