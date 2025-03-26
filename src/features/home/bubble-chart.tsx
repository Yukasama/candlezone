'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { sectorColors } from '@/lib/fmp/data/filters';
import { useEffect, useRef, useState } from 'react';
import { BubbleStock } from './actions/get-bubble-data';
import { regionMap } from './config/region-map';
import {
  formatParameterValue,
  getBubblePosition,
  getDatePosition,
  removeOutliers,
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
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [hoveredStock, setHoveredStock] = useState<string | undefined>();
  const [hoveredSector, setHoveredSector] = useState<string | undefined>();
  const [selectedSector, setSelectedSector] = useState<string | undefined>();
  const [showOnlyFuture, setShowOnlyFuture] = useState(false);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      assetsFilter !== 'all' &&
      assetsFilter !== 'stocks' &&
      (parameter === 'priceToEarningsRatioTTM' ||
        parameter === 'netProfitMarginTTM' ||
        parameter === 'earningsDate')
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

  useEffect(() => {
    setSelectedSector(sectorFilter === 'all' ? undefined : sectorFilter);
  }, [sectorFilter]);

  const handleRegionChange = (value: string) => {
    const newRegion = value as RegionFilter;
    if (newRegion !== regionFilter && sectorFilter !== 'all') {
      const sectorsInNewRegion = [
        ...new Set(
          stocks
            .filter((stock) => {
              if (newRegion !== 'all') {
                const stockRegion = regionMap[stock.country ?? ''] || 'unknown';
                return stockRegion === newRegion && stock.type === 'stock';
              }
              return stock.type === 'stock';
            })
            .map((stock) => stock.sector),
        ),
      ].filter(Boolean) as string[];

      if (!sectorsInNewRegion.includes(sectorFilter)) {
        setSectorFilter('all');
      }
    }

    setRegionFilter(newRegion);
  };

  const isSectorVisible =
    regionFilter !== 'all' &&
    assetsFilter !== 'crypto' &&
    assetsFilter !== 'commodities';

  useEffect(() => {
    if (selectedSector) {
      const availableSectors = [
        ...new Set(
          stocks
            .filter((stock) => {
              if (isSectorVisible) {
                const stockRegion = regionMap[stock.country ?? ''] || 'unknown';
                return stockRegion === regionFilter;
              }
              return true;
            })
            .filter((stock) => stock.type === 'stock' && stock.sector)
            .map((stock) => stock.sector),
        ),
      ].filter(Boolean) as string[];

      if (!availableSectors.includes(selectedSector)) {
        setSectorFilter('all');
        setSelectedSector(undefined);
      }
    }
  }, [regionFilter, selectedSector, stocks, assetsFilter, isSectorVisible]);

  const handleAssetFilterChange = (value: string) => {
    const newFilter = value as AssetsFilter;
    setAssetsFilter(newFilter);

    if (newFilter === 'crypto' || newFilter === 'commodities') {
      setRegionFilter('all');
      setSectorFilter('all');
      setSelectedSector(undefined);
    }
  };

  const handleSectorMouseEnter = (sector: string) => {
    setHoveredSector(sector);
  };

  const handleSectorMouseLeave = () => {
    setHoveredSector(undefined);
  };

  const handleSectorClick = (sector: string) => {
    if (selectedSector === sector) {
      setSelectedSector(undefined);
      setSectorFilter('all');
    } else {
      setSelectedSector(sector);
      setSectorFilter(sector);
    }
  };

  const handleParameterChange = (value: string) => {
    const newParam = value as XAxisParameter;
    setParameter(newParam);

    if (newParam !== 'earningsDate') {
      setShowOnlyFuture(false);
    }
  };

  let filteredStocks = stocks.filter((stock) => {
    if (parameter !== 'marketCap' && stock.type !== 'stock') {
      return false;
    }

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

    if (
      regionFilter !== 'all' &&
      assetsFilter !== 'crypto' &&
      assetsFilter !== 'commodities'
    ) {
      const stockRegion = regionMap[stock.country ?? ''] || 'unknown';
      if (stockRegion !== regionFilter) {
        return false;
      }
    }

    if (sectorFilter !== 'all') {
      return stock.sector === sectorFilter;
    }

    if (parameter === 'earningsDate') {
      if (
        !stock.earningsDate ||
        String(stock.earningsDate) === 'No date' ||
        Number.isNaN(new Date(stock.earningsDate).getTime())
      ) {
        return false;
      }

      if (showOnlyFuture) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const earningsDate = new Date(stock.earningsDate);

        if (earningsDate < today) {
          return false;
        }
      }
    }

    return true;
  });

  filteredStocks = removeOutliers(filteredStocks, parameter);
  filteredStocks = filteredStocks.slice(0, 50);

  const parameterValues = filteredStocks.map((stock) => {
    switch (parameter) {
      case 'earningsDate': {
        return stock.earningsDate ? new Date(stock.earningsDate).getTime() : 0;
      }
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

  const representedSectors = [
    ...new Set(
      filteredStocks
        .filter((stock) => stock.type === 'stock' && stock.sector)
        .map((stock) => stock.sector),
    ),
  ].filter(Boolean) as string[];

  return (
    <div className="w-full space-y-2 lg:h-full">
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
        <div className="absolute top-0 right-3 left-0 z-10 flex justify-between">
          <div className="bg-background/90 m-3 flex h-7 flex-col rounded-md px-1 text-xs font-medium sm:flex-row lg:text-base">
            <span className="text-muted-foreground mr-1 text-xs sm:mt-0.5">
              Min:
            </span>
            {formatParameterValue(parameter, minValue)}
          </div>
          <div className="bg-background/90 m-2 rounded-md py-1 text-sm">
            <span className="text-muted-foreground block text-center text-xs">
              Parameter
            </span>
            <Select onValueChange={handleParameterChange} value={parameter}>
              <SelectTrigger
                aria-label="Select Parameter"
                className="ml-1 h-7 border-0 bg-transparent py-0 shadow-none"
              >
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
                <SelectItem
                  disabled={assetsFilter !== 'all' && assetsFilter !== 'stocks'}
                  value="earningsDate"
                >
                  Earnings Date
                </SelectItem>
              </SelectContent>
            </Select>

            {parameter === 'earningsDate' && (
              <div className="mt-1 flex items-center space-x-2">
                <Switch
                  checked={showOnlyFuture}
                  onCheckedChange={setShowOnlyFuture}
                />
                <Label className="cursor-pointer text-xs">
                  Show only future
                </Label>
              </div>
            )}
          </div>
          <div className="bg-background/90 m-3 flex h-7 flex-col rounded-md text-right text-xs font-medium sm:flex-row lg:text-base">
            <span className="text-muted-foreground text-xs sm:mt-0.5">
              Max:
            </span>
            <span className="ml-1">
              {formatParameterValue(parameter, maxValue)}
            </span>
          </div>
        </div>

        <div className="bg-background/90 absolute top-14 left-4 flex items-center gap-1 text-[15px] font-medium sm:top-12">
          <span className="text-success">↑</span>
          <p>+{displayMaxChangePct}%</p>
        </div>

        <div className="bg-background/90 absolute bottom-4 left-4 flex items-center gap-1 text-[15px] font-medium">
          <span className="text-destructive">↓</span>
          <p>-{displayMaxChangePct}%</p>
        </div>

        <div className="absolute right-4 bottom-4 z-10 space-y-2">
          <div className="bg-background/90 rounded-md">
            <span className="text-muted-foreground block text-xs">Region</span>
            <Select onValueChange={handleRegionChange} value={regionFilter}>
              <SelectTrigger
                aria-label="Select Region"
                className="mr-1.5 h-7 min-w-[104px] border-0 bg-transparent px-1 py-0 shadow-none"
              >
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem disabled={isRegionFilterDisabled} value="america">
                  America
                </SelectItem>
                <SelectItem disabled={isRegionFilterDisabled} value="europe">
                  Europe
                </SelectItem>
                <SelectItem disabled={isRegionFilterDisabled} value="asia">
                  Asia
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-background/90 rounded-md">
            <span className="text-muted-foreground block text-xs">
              Asset Type
            </span>
            <Select
              onValueChange={handleAssetFilterChange}
              value={assetsFilter}
            >
              <SelectTrigger
                aria-label="Select Asset Type"
                className="h-7 border-0 bg-transparent px-1 py-0 shadow-none"
              >
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="stocks">Stocks</SelectItem>
                <SelectItem value="commodities">Commodities</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-muted-foreground/30 absolute top-1/2 right-5 left-5 z-10 border-t border-dashed" />

        {parameter === 'earningsDate' && !showOnlyFuture ? (
          <>
            <div
              className="border-muted-foreground/30 absolute top-0 bottom-0 z-10 border-r border-dashed"
              style={{
                left: `${String(getDatePosition(new Date(), minValue, maxValue) * 100)}%`,
              }}
            />
            <div
              className="bg-background/90 text-desc absolute top-0 z-10 rounded-md px-1 py-0.5 text-[13px] font-semibold"
              style={{
                left: `${String(getDatePosition(new Date(), minValue, maxValue) * 100 - 1.4)}%`,
              }}
            >
              Today
            </div>
          </>
        ) : undefined}

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

            const isHighlighted =
              hoveredStock === stock.symbol ||
              (stock.sector &&
                (hoveredSector === stock.sector ||
                  (selectedSector && stock.sector === selectedSector)));

            const isOtherHovered =
              (hoveredStock !== undefined && hoveredStock !== stock.symbol) ||
              ((hoveredSector !== undefined || selectedSector !== undefined) &&
                (stock.sector
                  ? stock.sector !== hoveredSector &&
                    stock.sector !== selectedSector
                  : true));

            return (
              <StockBubble
                isHovered={isHighlighted ?? undefined}
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
                    className="size-3 rounded-full"
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
