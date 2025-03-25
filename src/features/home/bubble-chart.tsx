'use client';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sectorColors } from '@/lib/fmp/data/filters';
import { useEffect, useRef, useState } from 'react';
import { BubbleStock } from './actions/get-bubble-data';
import { regionMap } from './config/region-map';
import { formatParameterValue, getBubblePosition } from './lib/bubble-helpers';
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
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [hoveredStock, setHoveredStock] = useState<string | undefined>();
  const [hoveredSector, setHoveredSector] = useState<string | undefined>();
  const [selectedSector, setSelectedSector] = useState<string | undefined>();
  const chartRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  useEffect(() => {
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

  // Update selectedSector when sectorFilter changes via dropdown
  useEffect(() => {
    setSelectedSector(sectorFilter === 'all' ? undefined : sectorFilter);
  }, [sectorFilter]);

  const handleAssetFilterChange = (value: string) => {
    const newFilter = value as AssetsFilter;
    setAssetsFilter(newFilter);

    if (newFilter === 'crypto' || newFilter === 'commodities') {
      setRegionFilter('all');
      setSectorFilter('all');
      setSelectedSector(undefined);
    }
  };

  // Handle mouse enter/leave for sector badges
  const handleSectorMouseEnter = (sector: string) => {
    setHoveredSector(sector);
  };

  const handleSectorMouseLeave = () => {
    setHoveredSector(undefined);
  };

  // Handle sector badge click - toggle selection
  const handleSectorClick = (sector: string) => {
    if (selectedSector === sector) {
      // If already selected, clear selection
      setSelectedSector(undefined);
      setSectorFilter('all');
    } else {
      // Select this sector
      setSelectedSector(sector);
      setSectorFilter(sector);
    }
  };

  const filteredStocks = stocks
    .filter((stock) => {
      // Filter by asset type
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

      // Filter by region
      if (
        regionFilter !== 'all' &&
        assetsFilter !== 'crypto' &&
        assetsFilter !== 'commodities'
      ) {
        const stockRegion = regionMap[stock.country ?? ''] || 'unknown';
        return stockRegion === regionFilter;
      }

      // Filter by sector - this needs to change to handle stocks without sectors correctly
      if (sectorFilter !== 'all') {
        // Only show stocks that have the selected sector
        // Note that if a stock has no sector, it won't be shown when a sector filter is active
        return stock.sector === sectorFilter;
      }

      return true;
    })
    .slice(0, 50);

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

  const minValue = Math.min(...parameterValues.filter((v) => v > 0)) || 0;
  const maxValue = Math.max(...parameterValues) || 1;
  const displayMaxChangePct = 10;

  const isRegionFilterDisabled =
    assetsFilter === 'crypto' || assetsFilter === 'commodities';

  // Get sectors that exist in the filtered stocks
  const representedSectors = [
    ...new Set(
      filteredStocks
        .filter((stock) => stock.type === 'stock' && stock.sector)
        .map((stock) => stock.sector),
    ),
  ].filter(Boolean) as string[];

  return (
    <div className="w-full space-y-2 lg:h-full">
      <div className="mb-4 flex flex-wrap items-center gap-2 px-1">
        <div className="flex w-full flex-col gap-1 sm:w-auto">
          <span className="text-muted-foreground text-xs">Region</span>
          <Tabs
            className="w-full sm:w-auto"
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
        </div>

        <div className="flex w-full flex-col gap-1 sm:w-auto">
          <span className="text-muted-foreground text-xs">Asset Type</span>
          <Tabs
            className="w-full sm:w-auto"
            onValueChange={handleAssetFilterChange}
            value={assetsFilter}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div
        className="relative h-[690px] w-full overflow-hidden rounded-xl border"
        ref={chartRef}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100,100,100,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100,100,100,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
          boxShadow: 'inset 0 0 70px 50px rgba(0,0,0,0.02)',
        }}
      >
        <div className="absolute top-0 right-0 left-0 z-10 flex justify-between">
          <div className="bg-background/90 m-3 rounded-md px-2 py-1.5 text-sm font-medium lg:text-base">
            <span className="text-muted-foreground mr-1 text-xs">Min:</span>
            {formatParameterValue(parameter, minValue)}
          </div>
          <div className="bg-background/90 m-3 rounded-md px-3 py-1.5 text-sm font-medium">
            <span className="text-muted-foreground block text-center text-xs">
              Parameter
            </span>
            <Select
              onValueChange={(v) => setParameter(v as XAxisParameter)}
              value={parameter}
            >
              <SelectTrigger className="ml-1.5 h-9 w-full border-none">
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
          <div className="bg-background/90 m-3 rounded-md px-2 py-1.5 text-sm font-medium lg:text-base">
            <span className="text-muted-foreground mr-1 text-xs">Max:</span>
            {formatParameterValue(parameter, maxValue)}
          </div>
        </div>

        {/* Y-Axis Labels */}
        <div className="absolute top-8 bottom-0 left-0 z-10 m-3 flex flex-col justify-between">
          <div className="bg-background/90 flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium">
            <span className="text-success mr-1 text-xs">↑</span>
            <p>+{displayMaxChangePct}%</p>
          </div>
          {/* Move Y-axis label to the left border */}

          <div className="bg-background/90 flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium">
            <span className="text-destructive text-xs">↓</span>
            <p>-{displayMaxChangePct}%</p>
          </div>
        </div>

        <div className="border-muted-foreground/30 absolute top-1/2 right-5 left-5 z-10 border-t border-dashed" />

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

            // Determine if this stock should be highlighted or dimmed
            const isHighlighted =
              hoveredStock === stock.symbol ||
              hoveredSector === stock.sector ||
              (selectedSector && stock.sector === selectedSector);

            const isOtherHovered =
              (hoveredStock !== undefined && hoveredStock !== stock.symbol) ||
              ((hoveredSector !== undefined || selectedSector !== undefined) &&
                stock.sector !== hoveredSector &&
                stock.sector !== selectedSector);

            return (
              <StockBubble
                isHovered={isHighlighted}
                isOtherHovered={isOtherHovered}
                key={stock.symbol}
                position={position}
                setHoveredStock={setHoveredStock}
                stock={stock}
              />
            );
          })}
      </div>

      {representedSectors.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {representedSectors.map((sector) => {
            const sectorColor = sectorColors[sector] || '#888';
            const isHovered = hoveredSector === sector;
            const isSelected = selectedSector === sector;

            return (
              <div
                className="inline-block"
                key={sector}
                onMouseEnter={() => handleSectorMouseEnter(sector)}
                onMouseLeave={handleSectorMouseLeave}
              >
                <Badge
                  className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5"
                  onClick={() => handleSectorClick(sector)}
                  variant={isHovered || isSelected ? 'secondary' : 'outline'}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: sectorColor }}
                  />
                  <span className="text-xs">{sector}</span>
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
