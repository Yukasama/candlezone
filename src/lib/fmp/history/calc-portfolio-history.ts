import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { PortfolioHistoryProps } from '@/lib/validators/portfolio'
import { History } from '@/types/stock'
import { uniq } from 'lodash'

interface DailyHistory {
  symbol: string
  historical: History[]
}

interface MultipleDailyHistory {
  historicalStockList: DailyHistory[]
}

export const calcPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const { portfolioId, options } = values

  const stocksInPortfolio = await db.portfolioOrder.findMany({
    select: {
      date: true,
      createdAt: true,
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
  })

  if (stocksInPortfolio.length === 0) {
    return []
  }

  const symbols = uniq(
    stocksInPortfolio.map((order) => order.stock.symbol),
  ).join(',')

  let earliestDate = stocksInPortfolio[0].date
  for (const order of stocksInPortfolio) {
    if (order.date < earliestDate) {
      earliestDate = order.date
    }
  }

  const response = await fetch(
    `${appConfig.fmp.url}v3/historical-price-full/${symbols}?from=${earliestDate.toISOString().split('T')[0]}&apikey=${env.FMP_API_KEY}`,
  )

  if (!response.ok) {
    logger.error(
      'calcPortfolioHistory (error): Fetch failed, status: %s',
      response.status,
    )
    throw new Error('Failed to fetch historical data.')
  }

  const data = symbols.includes(',')
    ? ((await response.json()) as MultipleDailyHistory)
    : ((await response.json()) as DailyHistory)

  const stockDataList =
    'historicalStockList' in data
      ? data.historicalStockList
      : [{ symbol: symbols, historical: data.historical }]

  const result: Record<string, { date: string; return: number }> = {}

  for (const stockData of stockDataList) {
    const symbol = stockData.symbol
    const orders = stocksInPortfolio.filter(
      (order) => order.stock.symbol === symbol && !order.deleted,
    ) // Ignore deleted orders
    const currentQuantity = 0
    const currentTotalCost = 0
    let realizedPL = 0

    const dateOrderMap = new Map<
      string,
      { quantity: number; totalCost: number }
    >()

    for (const order of orders) {
      const orderDateStr = order.date.toISOString().split('T')[0]
      if (!dateOrderMap.has(orderDateStr)) {
        dateOrderMap.set(orderDateStr, { quantity: 0, totalCost: 0 })
      }
      const dateEntry = dateOrderMap.get(orderDateStr)!
      if (order.type === 'BUY') {
        dateEntry.quantity += order.quantity
        dateEntry.totalCost += order.quantity * order.price
      } else if (order.type === 'SELL') {
        const sellQuantity = Math.min(currentQuantity, order.quantity)
        if (sellQuantity > 0) {
          realizedPL +=
            sellQuantity * order.price -
            (currentTotalCost / currentQuantity) * sellQuantity
          dateEntry.quantity -= sellQuantity
          dateEntry.totalCost -=
            (currentTotalCost / currentQuantity) * sellQuantity
        }
      }
    }

    // Process historical data
    let lastQuantity = 0
    let lastTotalCost = 0
    for (const historicalEntry of stockData.historical) {
      const historicalDateStr = historicalEntry.date

      // Update current totals based on order map
      if (dateOrderMap.has(historicalDateStr)) {
        const orderInfo = dateOrderMap.get(historicalDateStr)!
        lastQuantity += orderInfo.quantity
        lastTotalCost += orderInfo.totalCost
      }

      if (lastQuantity > 0) {
        const averageBuyPrice = lastTotalCost / lastQuantity
        const unrealizedPL =
          (historicalEntry.close - averageBuyPrice) * lastQuantity
        const totalPL =
          unrealizedPL + (options?.showRealizedPL ? realizedPL : 0)

        if (!result[historicalDateStr]) {
          result[historicalDateStr] = { date: historicalDateStr, return: 0 }
        }

        result[historicalDateStr].return += totalPL
      }
    }
  }

  const history = Object.keys(result)
    .sort((a, b) => a.localeCompare(b))
    .map((date) => {
      const entry = result[date]
      return {
        date,
        return: entry.return,
      }
    })
    .filter((entry) => entry.return !== 0)

  logger.info(
    'calcPortfolioHistory (done): portfolioId=%s history=%o',
    portfolioId,
    history,
  )

  return history
}
