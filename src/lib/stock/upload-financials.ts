import 'server-only'
import { db } from '@/lib/db'
import { FMP_API_URL } from '@/config/fmp/config'
import { env } from '@/env.mjs'
import { Financials, Stock } from '@prisma/client'

export const uploadFinancials = async (
  stock: Pick<Stock, 'id' | 'symbol'>,
  all: boolean = false
) => {
  const entries = all ? 120 : 1
  const financialUrls = [
    `${FMP_API_URL}v3/income-statement/${stock.symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/balance-sheet-statement/${stock.symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/cash-flow-statement/${stock.symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/ratios/${stock.symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/key-metrics/${stock.symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
  ]

  const financials = await Promise.allSettled(
    financialUrls.map(
      async (url) =>
        await fetch(url, { cache: 'no-cache' }).then((res) => res.json())
    )
  ).then((results) => {
    return results
      .filter((result) => result.status === 'fulfilled')
      .map((result: any) => result.value)
  })

  const mergedFinancials = mergeFinancials(financials)
  const linkedFinancials = mergedFinancials.map((financial: any) => ({
    ...financial,
    stockId: stock.id,
    errorMessage: financial['Error Message'] ?? null,
    priceToBookRatio: undefined,
    acceptedDate: undefined,
    link: undefined,
    finalLink: undefined,
  }))

  try {
    await db.financials.createMany({
      data: linkedFinancials,
    })
  } catch (error: any) {
    throw new Error(
      `Financials insert for ${stock.symbol} failed: ${error.message}`
    )
  }
}

function mergeFinancials(arrays: Financials[][]): Financials[] {
  const mergedRecords: Record<string, Financials> = {}

  arrays.forEach((array) => {
    array.forEach((record) => {
      if (mergedRecords[record.date]) {
        mergedRecords[record.date] = {
          ...mergedRecords[record.date],
          ...record,
        }
      } else {
        mergedRecords[record.date] = record
      }
    })
  })

  return Object.values(mergedRecords)
}
