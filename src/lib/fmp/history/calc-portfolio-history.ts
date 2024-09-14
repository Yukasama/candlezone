import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { PortfolioHistoryProps } from '@/lib/validators/portfolio';
import { History } from '@/types/stock';
import { uniq } from 'lodash';

interface DailyHistory {
  symbol: string;
  historical: History[];
}

interface MultipleDailyHistory {
  historicalStockList: DailyHistory[];
}

function isMultipleDailyHistory(data: unknown): data is MultipleDailyHistory {
  return (
    typeof data === 'object' &&
    data !== null &&
    'historicalStockList' in data &&
    Array.isArray((data as MultipleDailyHistory).historicalStockList)
  );
}

function isDailyHistory(data: unknown): data is DailyHistory {
  return (
    typeof data === 'object' &&
    data !== null &&
    'symbol' in data &&
    'historical' in data &&
    Array.isArray((data as DailyHistory).historical)
  );
}

export const calcPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const { portfolioId, options = { showRealizedPL: true } } = values;

  const stocksInPortfolio = await db.portfolioOrder.findMany({
    select: {
      date: true,
      price: true,
      type: true,
      quantity: true,
      deleted: true,
      stock: {
        select: { symbol: true },
      },
    },
    where: { portfolioId },
    orderBy: { date: 'asc' },
  });

  if (stocksInPortfolio.length === 0) {
    logger.info(
      'calcPortfolioHistory: No orders found for portfolioId=%s',
      portfolioId,
    );
    return [];
  }

  const symbols = uniq(stocksInPortfolio.map((order) => order.stock.symbol));

  let earliestDate = stocksInPortfolio[0].date;
  for (const order of stocksInPortfolio) {
    if (order.date < earliestDate) {
      earliestDate = order.date;
    }
  }

  const today = new Date();
  if (earliestDate > today) {
    logger.warn(
      'calcPortfolioHistory: Earliest order date (%s) is in the future. Adjusting to today (%s).',
      earliestDate.toISOString().split('T')[0],
      today.toISOString().split('T')[0],
    );
    earliestDate = today;
  }

  const symbolsString = symbols.join(',');

  const response = await fetch(
    `${appConfig.fmp.url}v3/historical-price-full/${symbolsString}?from=${
      earliestDate.toISOString().split('T')[0]
    }&to=${today.toISOString().split('T')[0]}&apikey=${env.FMP_API_KEY}`,
  );

  if (!response.ok) {
    logger.error(
      'calcPortfolioHistory (error): Fetch failed, status: %s',
      response.status,
    );
    throw new Error('Failed to fetch historical data.');
  }

  const dataJson: unknown = await response.json();
  if (!dataJson || Object.keys(dataJson as object).length === 0) {
    logger.error('calcPortfolioHistory (error): No historical data returned.');
    return [];
  }

  let stockDataList: DailyHistory[] = [];

  if (isMultipleDailyHistory(dataJson)) {
    stockDataList = dataJson.historicalStockList;
  } else if (isDailyHistory(dataJson)) {
    stockDataList = [dataJson];
  } else {
    logger.error(
      'calcPortfolioHistory (error): Unexpected data format from API.',
    );
    return [];
  }

  if (stockDataList.length === 0) {
    logger.error('calcPortfolioHistory (error): No historical data available.');
    return [];
  }

  const result: Record<string, number> = {};

  for (const stockData of stockDataList) {
    const symbol = stockData.symbol;
    const orders = stocksInPortfolio.filter(
      (order) => order.stock.symbol === symbol && !order.deleted,
    );

    if (orders.length === 0) {
      continue;
    }

    const historicalPricesByDate: Record<string, number> = {};
    for (const historicalEntry of stockData.historical) {
      historicalPricesByDate[historicalEntry.date] = historicalEntry.close;
    }

    const ordersByDate: Record<string, typeof orders> = {};
    for (const order of orders) {
      let dateStr = order.date.toISOString().split('T')[0];

      if (!(dateStr in historicalPricesByDate)) {
        const availableDates = Object.keys(historicalPricesByDate)
          .filter((d) => new Date(d) >= new Date(dateStr))
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        if (availableDates.length > 0) {
          dateStr = availableDates[0];
        } else {
          logger.error(
            `No available price data after order date ${
              order.date.toISOString().split('T')[0]
            } for symbol ${symbol}. Skipping order.`,
          );
          continue;
        }
      }

      if (!ordersByDate[dateStr]) {
        ordersByDate[dateStr] = [];
      }
      ordersByDate[dateStr].push(order);
    }

    let cumulativeQuantity = 0;
    let cumulativeCost = 0;
    let realizedPL = 0;

    const allDates = Object.keys(historicalPricesByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    for (const dateStr of allDates) {
      if (ordersByDate[dateStr]) {
        for (const order of ordersByDate[dateStr]) {
          if (order.type === 'BUY') {
            cumulativeQuantity += order.quantity;
            cumulativeCost += order.quantity * order.price;
          } else if (order.type === 'SELL') {
            const sellQuantity = order.quantity;

            if (cumulativeQuantity >= sellQuantity) {
              const averageCostPrice = cumulativeCost / cumulativeQuantity;
              realizedPL += sellQuantity * (order.price - averageCostPrice);
              cumulativeCost -= averageCostPrice * sellQuantity;
              cumulativeQuantity -= sellQuantity;
            } else {
              const adjustedSellQuantity = cumulativeQuantity;
              if (adjustedSellQuantity > 0) {
                const averageCostPrice = cumulativeCost / cumulativeQuantity;
                realizedPL +=
                  adjustedSellQuantity * (order.price - averageCostPrice);
                cumulativeCost -= averageCostPrice * adjustedSellQuantity;
                cumulativeQuantity -= adjustedSellQuantity;
              }
            }
          }
        }
      }

      const price = historicalPricesByDate[dateStr];
      if (price === undefined) {
        continue;
      }

      const positionValue = cumulativeQuantity * price;
      const unrealizedPL = positionValue - cumulativeCost;
      const totalPL = unrealizedPL + (options?.showRealizedPL ? realizedPL : 0);

      if (result[dateStr] === undefined) {
        result[dateStr] = totalPL;
      } else {
        result[dateStr] += totalPL;
      }
    }
  }

  const history = Object.keys(result)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => {
      return {
        date,
        return: result[date],
      };
    });

  logger.info(
    'calcPortfolioHistory (done): portfolioId=%s history=%o',
    portfolioId,
    history,
  );

  return history;
};
