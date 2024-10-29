import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import { PortfolioHistoryProps } from '@/features/portfolio/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { uniq } from 'lodash';
import { DailyHistory } from '../types/history';
import { isDailyHistory, isMultipleDailyHistory } from './history-helpers';

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
  let latestOrderDate = stocksInPortfolio[0].date;
  for (const order of stocksInPortfolio) {
    if (order.date < earliestDate) {
      earliestDate = order.date;
    }
    if (order.date > latestOrderDate) {
      latestOrderDate = order.date;
    }
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

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
    }&to=${yesterday.toISOString().split('T')[0]}&apikey=${env.FMP_API_KEY}`,
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

  const dateSet = new Set<string>();
  const currentDate = new Date(earliestDate);
  while (currentDate <= today) {
    dateSet.add(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const allDates = [...dateSet].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

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
          const lastAvailableDate = Object.keys(historicalPricesByDate).sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime(),
          )[0];

          if (lastAvailableDate) {
            dateStr = lastAvailableDate;
          } else {
            logger.error(
              `No available price data for symbol ${symbol}. Skipping order dated ${order.date.toISOString().split('T')[0]}.`,
            );
            continue;
          }
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
    let lastAvailablePrice = 0;

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

      let price = historicalPricesByDate[dateStr];
      if (price) {
        lastAvailablePrice = price;
      } else {
        if (lastAvailablePrice === 0) {
          continue;
        }
        price = lastAvailablePrice;
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

  const history = allDates
    .filter((date) => result[date] !== undefined)
    .map((date) => {
      return {
        date,
        return: result[date],
      };
    });

  logger.debug(
    'calcPortfolioHistory (done): portfolioId=%s history=%o',
    portfolioId,
    history.at(-1),
  );

  return history;
};
