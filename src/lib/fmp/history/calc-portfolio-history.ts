import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { db } from '@/lib/db'
import 'server-only'

export const calcPortfolioHistory = async (
  portfolioId: string,
  /* eslint-disable no-unused-vars */
  timeframe: string,
  /* eslint-enable no-unused-vars */
) => {
  const stocksInPortfolio = await db.stockInPortfolio.findMany({
    select: {
      createdAt: true,
      quantity: true,
      stock: {
        select: { symbol: true },
      },
    },
    where: { portfolioId },
  })

  const symbols = stocksInPortfolio.map((stock) => stock.stock.symbol).join(',')

  const data = await fetch(
    `${appConfig.fmp.url}v3/historical-price-full/${symbols}?apikey=${env.FMP_API_KEY}`,
  ).then((res) => res.json())

  const result: any = {}
  data.forEach((symbolData: any) => {
    Object.keys(symbolData).forEach((range) => {
      if (!result[range]) {
        result[range] = []
      }

      symbolData[range].forEach((entry: any, i: any) => {
        if (!result[range][i]) {
          result[range][i] = {
            date: entry.date,
            close: 0,
            count: 0,
          }
        }

        const entryAddedAfter =
          new Date(entry.date) >=
          new Date(stocksInPortfolio[i].createdAt.toDateString().split('T')[0])

        if (entryAddedAfter) {
          result[range][i].close += entry.close
          result[range][i].count++
        }
      })
    })
  })

  Object.keys(result).forEach((range) => {
    result[range] = result[range]
      .filter((entry: any) => entry.count > 0)
      .map((entry: any) => {
        return {
          date: entry.date,
          close: entry.close / entry.count,
        }
      })
  })

  return result
}
