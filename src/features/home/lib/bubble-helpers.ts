import { StockQuote } from '@/features/stock/types/stock';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { XAxisParameter } from './types/bubblechart';

/**
 * Get the formatted label for the current x-axis parameter
 */
export const getParameterLabel = (parameter: XAxisParameter): string => {
  switch (parameter) {
    case 'marketCap': {
      return 'Market Cap';
    }
    case 'priceToEarningsRatioTTM': {
      return 'P/E Ratio';
    }
    case 'volume': {
      return 'Trading Volume';
    }
  }
};

/**
 * Format the parameter value based on its type
 */
export const formatParameterValue = (
  parameter: XAxisParameter,
  value: number,
): string => {
  switch (parameter) {
    case 'marketCap': {
      return formatMarketCap(value);
    }
    case 'priceToEarningsRatioTTM': {
      return value.toFixed(2);
    }
    case 'volume': {
      return value.toLocaleString();
    }
  }
};

/**
 * Calculate opacity based on percentage change
 */
export const getBackgroundOpacity = (
  changePct: number,
  displayMaxChangePct: number,
  actualMaxChangePct: number,
): number => {
  const absChangePct = Math.abs(changePct);
  const baseOpacity = 0.2;

  if (absChangePct < 0.5) {
    return baseOpacity;
  }

  const maxOpacity = 0.8; // Increased from 0.6 as requested
  const scaleMax = Math.max(actualMaxChangePct, displayMaxChangePct);

  return baseOpacity + (absChangePct / scaleMax) * (maxOpacity - baseOpacity);
};

/**
 * Calculate border opacity based on background opacity
 */
export const getBorderOpacity = (
  changePct: number,
  displayMaxChangePct: number,
  actualMaxChangePct: number,
): number => {
  const bgOpacity = getBackgroundOpacity(
    changePct,
    displayMaxChangePct,
    actualMaxChangePct,
  );
  return Math.min(bgOpacity + 0.2, 1);
};

/**
 * Calculate bubble position and related info
 */
export const getBubblePosition = (
  stock: StockQuote,
  parameter: XAxisParameter,
  dimensions: { height: number; width: number },
  minValue: number,
  maxValue: number,
  displayMaxChangePct: number,
) => {
  const getValue = (): number => {
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
  };

  const value = getValue();

  // Logarithmic scale for better distribution
  const x =
    value <= 0
      ? 0
      : (Math.log(value) - Math.log(minValue)) /
        (Math.log(maxValue) - Math.log(minValue));

  const changePct = stock.changesPercentage ?? 0;
  const cappedChangePct = Math.min(
    Math.max(changePct, -displayMaxChangePct),
    displayMaxChangePct,
  );
  const y = 0.5 - cappedChangePct / (displayMaxChangePct * 2);

  const exceedsRange = Math.abs(changePct) > displayMaxChangePct;
  const excessAmount = Math.abs(changePct) - displayMaxChangePct;

  // Size based on market cap (optional)
  const size = 80; // Fixed size for now, could be made variable

  return {
    exceedsRange,
    excessAmount,
    isPositive: changePct > 0,
    originalChangePct: changePct,
    size,
    x: x * dimensions.width * 0.9 + dimensions.width * 0.05,
    y: y * dimensions.height * 0.8 + dimensions.height * 0.1,
  };
};
