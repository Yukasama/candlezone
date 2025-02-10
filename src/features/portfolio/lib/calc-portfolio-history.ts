import { PortfolioHistoryProps } from '@/features/portfolio/lib/validators';
import { fmpClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { DailyHistory, MultipleDailyHistory } from '@/lib/fmp/types/history';
import { logger } from '@/lib/logger';
import { uniq } from 'lodash';
import { isDailyHistory, isMultipleDailyHistory } from './history-helpers';

interface PortfolioReturn {
  date: string;
  return: number;
}

export const calcPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const { options = { showRealizedPL: true }, portfolioId } = values;

  const stocksInPortfolio = await db.portfolioOrder.findMany({
    orderBy: { date: 'asc' },
    select: {
      date: true,
      deleted: true,
      price: true,
      quantity: true,
      stock: {
        select: { symbol: true },
      },
      type: true,
    },
    where: { portfolioId },
  });

  if (stocksInPortfolio.length === 0) {
    logger.debug(
      'calcPortfolioHistory: No orders found for portfolioId=%s',
      portfolioId,
    );
    throw new Error('No orders found for portfolio.');
  }

  const symbols = uniq(stocksInPortfolio.map(({ stock }) => stock.symbol));

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
    earliestDate = today;
  }

  const symbolsString = symbols.join(',');

  const { data } = await fmpClient.get<
    DailyHistory | MultipleDailyHistory | undefined
  >(
    `v3/historical-price-full/${symbolsString}?from=${
      earliestDate.toISOString().split('T')[0]
    }&to=${yesterday.toISOString().split('T')[0]}`,
  );

  let stockDataList: DailyHistory[] = [];

  if (isMultipleDailyHistory(data)) {
    stockDataList = data.historicalStockList;
  } else if (isDailyHistory(data)) {
    stockDataList = [data];
  } else {
    logger.debug(
      'calcPortfolioHistory (error): Unexpected data format from API.',
    );
    throw new Error('Unexpected data format from API.');
  }

  if (stockDataList.length === 0) {
    logger.debug('calcPortfolioHistory (error): No historical data available.');
    throw new Error('No historical data available.');
  }

  const result: Record<string, number> = {};

  const dateSet = new Set<string>();
  let currentDate = new Date(earliestDate);
  while (currentDate <= today) {
    dateSet.add(currentDate.toISOString().split('T')[0]);
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
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
            logger.debug(
              'No available price data for symbol=%s. Skipping order (date=%s).',
              symbol,
              order.date.toISOString().split('T')[0],
            );
            continue;
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (ordersByDate[dateStr]?.length > 0) {
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
      const totalPL = unrealizedPL + (options.showRealizedPL ? realizedPL : 0);

      if (result[dateStr]) {
        result[dateStr] += totalPL;
      } else {
        result[dateStr] = totalPL;
      }
    }
  }

  const history: PortfolioReturn[] = allDates.map((date) => ({
    date,
    return: result[date] ?? 0,
  }));

  logger.debug(
    'calcPortfolioHistory (done): portfolioId=%s history=%o',
    portfolioId,
    history.at(-1),
  );

  return history;
};
