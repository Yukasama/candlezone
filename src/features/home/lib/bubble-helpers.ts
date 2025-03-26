import { StockQuote } from '@/features/stock/types/stock';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { XAxisParameter } from '../types/bubblechart';

/**
 * Get the formatted label for the current x-axis parameter
 */
export const getParameterLabel = (parameter: XAxisParameter): string => {
  switch (parameter) {
    case 'earningsDate': {
      return 'Earnings Date';
    }
    case 'marketCap': {
      return 'Market Cap';
    }
    case 'netProfitMarginTTM': {
      return 'Profit Margin';
    }
    case 'priceToEarningsRatioTTM': {
      return 'P/E Ratio';
    }
  }
};

/**
 * Calculate the relative position of a date between min and max date values
 */
export const getDatePosition = (
  date: Date,
  minValue: number,
  maxValue: number,
): number => {
  const now = date.getTime();

  // Handle cases where date is outside the range
  if (now <= minValue) {
    return 0;
  }
  if (now >= maxValue) {
    return 1;
  }

  // Calculate logarithmic position for better visual distribution
  const logMin = Math.log(minValue || 1);
  const logMax = Math.log(maxValue);
  const logNow = Math.log(now);

  // Calculate position as percentage (0 to 1)
  const position = (logNow - logMin) / (logMax - logMin);

  // Ensure position is within bounds
  return Math.max(0, Math.min(1, position));
};

/**
 * Format the parameter value based on its type
 */
export const formatParameterValue = (
  parameter: XAxisParameter,
  value: number,
): string => {
  switch (parameter) {
    case 'earningsDate': {
      if (value <= 0) {
        return 'No date';
      }
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    case 'marketCap': {
      return formatMarketCap(value);
    }
    case 'netProfitMarginTTM': {
      return `${(value * 100).toFixed(2)}%`;
    }
    case 'priceToEarningsRatioTTM': {
      return value.toFixed(2);
    }
  }
};

/**
 * Calculate opacity based on percentage change
 */
export const getBackgroundOpacity = (changePct: number): number => {
  const absChangePct = Math.abs(changePct);
  const baseOpacity = 0.1;

  if (absChangePct < 1) {
    return baseOpacity;
  } else if (absChangePct < 2.5) {
    return baseOpacity + 0.05;
  } else if (absChangePct < 5) {
    return baseOpacity + 0.1;
  } else if (absChangePct < 7.5) {
    return baseOpacity + 0.15;
  } else if (absChangePct < 10) {
    return baseOpacity + 0.18;
  } else {
    return 0.4;
  }
};

/**
 * Calculate border opacity based on background opacity
 */
export const getBorderOpacity = (changePct: number): number => {
  const bgOpacity = getBackgroundOpacity(changePct);
  return Math.min(bgOpacity + 0.2, 1);
};

/**
 * Calculate bubble position and related info with improved scaling
 */
export const getBubblePosition = (
  stock: StockQuote,
  parameter: XAxisParameter,
  dimensions: { height: number; width: number },
  minValue: number,
  maxValue: number,
  displayMaxChangePct: number,
) => {
  const MARKET_CAP_CAP = 4000000000000;
  const MIN_MARKET_CAP = 3000000000;

  const getValue = (): number => {
    switch (parameter) {
      case 'earningsDate': {
        return stock.earningsDate ? new Date(stock.earningsDate).getTime() : 0;
      }
      case 'marketCap': {
        const marketCap = stock.marketCap ?? 0;
        return marketCap > 0
          ? Math.max(MIN_MARKET_CAP, Math.min(marketCap, MARKET_CAP_CAP))
          : 0;
      }
      case 'netProfitMarginTTM': {
        return stock.netProfitMarginTTM ?? 0;
      }
      case 'priceToEarningsRatioTTM': {
        return stock.priceToEarningsRatioTTM ?? 0;
      }
    }
  };

  const adjustedMaxValue =
    parameter === 'marketCap' ? Math.min(maxValue, MARKET_CAP_CAP) : maxValue;

  const adjustedMinValue =
    parameter === 'marketCap' && minValue > 0
      ? Math.max(minValue, MIN_MARKET_CAP)
      : minValue;

  const value = getValue();

  let x = 0;
  if (value > 0) {
    if (parameter === 'marketCap') {
      const logValue = Math.log(value);
      const logMin = Math.log(adjustedMinValue);
      const logMax = Math.log(adjustedMaxValue);
      const range = logMax - logMin;

      const logPosition = (logValue - logMin) / range;

      if (logPosition < 0.15) {
        x = Math.pow(logPosition / 0.15, 0.5) * 0.2;
      } else if (logPosition < 0.4) {
        const segmentPosition = (logPosition - 0.15) / 0.25;
        x = 0.2 + Math.pow(segmentPosition, 0.7) * 0.25;
      } else if (logPosition < 0.7) {
        const segmentPosition = (logPosition - 0.4) / 0.3;
        x = 0.45 + Math.pow(segmentPosition, 0.9) * 0.25;
      } else {
        const segmentPosition = (logPosition - 0.7) / 0.3;
        x = 0.7 + Math.pow(segmentPosition, 1.5) * 0.3;
      }
    } else {
      x =
        (Math.log(value) - Math.log(adjustedMinValue)) /
        (Math.log(adjustedMaxValue) - Math.log(adjustedMinValue));
    }
  }

  x = Math.max(0, Math.min(1, x));

  const changePct = stock.changesPercentage ?? 0;
  const cappedChangePct = Math.min(
    Math.max(changePct, -displayMaxChangePct),
    displayMaxChangePct,
  );
  const y = 0.5 - cappedChangePct / (displayMaxChangePct * 2);

  const exceedsRange = Math.abs(changePct) > displayMaxChangePct;
  const excessAmount = Math.abs(changePct) - displayMaxChangePct;
  const baseBubbleSize = dimensions.width < 500 ? 50 : 70;

  let sizeMultiplier = 1;
  if (parameter === 'marketCap' && value > 0) {
    const logRatio = Math.log(value) / Math.log(adjustedMaxValue);
    sizeMultiplier = 0.8 + logRatio * 0.5;
  }

  const size = Math.min(baseBubbleSize * sizeMultiplier, dimensions.width / 7);

  const padding = size / 2;
  const safeX = Math.min(
    Math.max(x * dimensions.width * 0.98 + dimensions.width * 0.01, padding),
    dimensions.width - padding,
  );

  const safeY = Math.min(
    Math.max(y * dimensions.height * 0.73 + dimensions.height * 0.11, padding),
    dimensions.height - padding,
  );

  return {
    exceedsRange,
    excessAmount,
    isPositive: changePct > 0,
    originalChangePct: changePct,
    size,
    x: safeX,
    y: safeY,
  };
};
