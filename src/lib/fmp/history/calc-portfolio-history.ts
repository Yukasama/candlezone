import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { PortfolioHistoryProps } from '@/lib/validators/portfolio'
import 'server-only'

export const calcPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const { portfolioId } = values

  // Fetch orders for the specified portfolio
  const stocksInPortfolio = await db.portfolioOrder.findMany({
    select: {
      date: true,
      createdAt: true,
      price: true,
      type: true,
      quantity: true,
      stock: {
        select: { symbol: true },
      },
    },
    where: { portfolioId },
  })

  if (!stocksInPortfolio.length) {
    return []
  }

  // Find the earliest order date
  const earliestOrderDate = new Date(
    Math.min(
      ...stocksInPortfolio.map((order) => new Date(order.date).getTime()),
    ),
  )
    .toISOString()
    .split('T')[0] // Format as YYYY-MM-DD

  // Extract unique stock symbols
  const symbols = Array.from(
    new Set(stocksInPortfolio.map((order) => order.stock.symbol)),
  ).join(',')

  const response = await fetch(
    `${appConfig.fmp.url}v3/historical-price-full/${symbols}?apikey=${env.FMP_API_KEY}`,
  )

  if (!response.ok) {
    logger.error(
      'calcPortfolioHistory: Failed to fetch historical data, status: %s',
      response.status,
    )
    throw new Error('Failed to fetch historical data')
  }

  const data = await response.json()

  if (!data.historicalStockList) {
    logger.error(
      'calcPortfolioHistory: Historical data missing expected structure',
    )
    throw new Error('Historical data missing expected structure')
  }

  const result: Record<
    string,
    { date: string; totalValue: number; realizedPL: number }
  > = {}

  // Organize orders by stock symbol
  const stockOrderMap = new Map<string, typeof stocksInPortfolio>()

  stocksInPortfolio.forEach((order) => {
    if (!stockOrderMap.has(order.stock.symbol)) {
      stockOrderMap.set(order.stock.symbol, [])
    }
    stockOrderMap.get(order.stock.symbol)!.push(order)
  })

  const processHistoricalData = (historical: any[], symbol: string) => {
    const orders = stockOrderMap.get(symbol) || []
    let currentQuantity = 0
    let currentTotalCost = 0
    let realizedPL = 0

    // Sort historical data and orders by date
    historical.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    orders.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    historical.forEach((entry) => {
      const entryDate = new Date(entry.date)

      // Skip dates before the earliest order date
      if (entryDate < new Date(earliestOrderDate)) {
        return
      }

      // Skip weekends (Saturday and Sunday)
      if (entryDate.getDay() === 6 || entryDate.getDay() === 0) {
        return
      }

      // Apply orders up to and including this date
      orders.forEach((order) => {
        const orderDate = new Date(order.date)

        if (orderDate <= entryDate) {
          if (order.type === 'BUY') {
            currentQuantity += order.quantity
            currentTotalCost += order.quantity * order.price
          } else if (order.type === 'SELL') {
            const averageCost = currentTotalCost / currentQuantity
            const quantityToSell = Math.min(order.quantity, currentQuantity)
            const sellProceeds = quantityToSell * order.price
            const costOfSoldShares = quantityToSell * averageCost

            realizedPL += sellProceeds - costOfSoldShares
            currentTotalCost -= costOfSoldShares
            currentQuantity -= quantityToSell
          }
        }
      })

      // Calculate portfolio value based on current quantity and market price
      const marketValue = currentQuantity * (entry.close || 0)
      if (!result[entry.date]) {
        result[entry.date] = {
          date: entry.date,
          totalValue: 0,
          realizedPL: 0,
        }
      }
      result[entry.date].totalValue += marketValue
      result[entry.date].realizedPL += realizedPL

      logger.debug(
        'Processed date %s for symbol %s: currentQuantity=%d, marketValue=%d, realizedPL=%d',
        entry.date,
        symbol,
        currentQuantity,
        marketValue,
        realizedPL,
      )
    })
  }

  // Ensure that data contains historicalStockList
  const stockDataList = Array.isArray(data.historicalStockList)
    ? data.historicalStockList
    : [data]

  // Process historical data for each stock
  stockDataList.forEach((stockData) => {
    const symbol = stockData.symbol
    processHistoricalData(stockData.historical, symbol)
  })

  // Filter out zero-value entries
  const history = Object.keys(result)
    .sort()
    .map((date) => ({
      date,
      totalValue: result[date].totalValue,
      realizedPL: result[date].realizedPL,
    }))
    .filter((entry) => entry.totalValue !== 0 || entry.realizedPL !== 0) // Filter out zero-value entries

  logger.info(
    'calcPortfolioHistory (done): portfolioId=%s history=%o',
    portfolioId,
    history,
  )

  return history
}
