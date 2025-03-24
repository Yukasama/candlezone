'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useRef, useState } from 'react';
import { StockQuote } from '../stock/types/stock';
import { regionMap } from './config/region-map';
import {
  formatParameterValue,
  getBubblePosition,
  getParameterLabel,
} from './lib/bubble-helpers';
import { StockBubble } from './stock-bubble';
import { RegionFilter, XAxisParameter } from './types/bubblechart';

interface Props {
  stocks: StockQuote[];
}

export const StockBubbleChart = ({ stocks }: Props) => {
  const [parameter, setParameter] = useState<XAxisParameter>('marketCap');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [hoveredStock, setHoveredStock] = useState<string | undefined>();
  const chartRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

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

  const filteredStocks = stocks.filter((stock) => {
    if (regionFilter === 'all') {
      return true;
    }
    const stockRegion = regionMap[stock.country ?? ''] || 'other';
    return stockRegion === regionFilter;
  });

  const parameterValues = filteredStocks.map((stock) => {
    switch (parameter) {
      case 'marketCap': {
        return stock.marketCap ?? 0;
      }
      case 'priceToEarningsRatioTTM': {
        return stock.priceToEarningsRatioTTM ?? 0;
      }
      case 'volume': {
        return stock.volume ?? 0;
      }
    }
  });

  const minValue = Math.min(...parameterValues.filter((v) => v > 0));
  const maxValue = Math.max(...parameterValues);

  const changePctValues = filteredStocks.map((s) => s.changesPercentage ?? 0);
  const displayMaxChangePct = 10;
  const actualMaxChangePct = Math.max(
    ...changePctValues.map((value) => Math.abs(value)),
  );

  return (
    <div className="h-full w-full space-y-2">
      <div className="flex flex-wrap gap-2">
        <Select
          onValueChange={(v) => setRegionFilter(v as RegionFilter)}
          value={regionFilter}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="america">America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) => setParameter(v as XAxisParameter)}
          value={parameter}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Parameter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="marketCap">Market Cap</SelectItem>
            <SelectItem value="priceToEarningsRatioTTM">P/E Ratio</SelectItem>
            <SelectItem value="volume">Trading Volume</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative h-[690px] w-full" ref={chartRef}>
        <div className="absolute right-0 bottom-0 left-0 flex justify-between">
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
                actualMaxChangePct={actualMaxChangePct}
                displayMaxChangePct={displayMaxChangePct}
                isHovered={hoveredStock === stock.symbol}
                isOtherHovered={isOtherHovered}
                key={stock.symbol}
                parameter={parameter}
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
