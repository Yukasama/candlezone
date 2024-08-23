import { db } from '@/lib/db'
import { Stock } from '@prisma/client'
import DividendChart from './dividend-chart'
import MarginChart from './margin-chart'
import MetricsChart from './metrics-chart'

interface Props {
  stock: Pick<Stock, 'symbol' | 'companyName'>
}

export const Statistics = async ({ stock }: Readonly<Props>) => {
  const financials = await db.financials.findMany({
    select: {
      priceEarningsRatio: true,
      priceToSalesRatio: true,
      priceToBookRatio: true,
      priceEarningsToGrowthRatio: true,
      grossProfitMargin: true,
      operatingProfitMargin: true,
      netProfitMargin: true,
      dividendYield: true,
    },
    where: {
      symbol: stock.symbol,
      date: { gte: '2015-01-01' },
    },
    orderBy: { date: 'desc' },
    take: 8,
  })

  if (!financials) {
    return
  }

  const currentYear = new Date().getFullYear()
  const startYear = currentYear - financials.length
  const chartYearRange = Math.max(2015, startYear)

  const labels = Array.from({ length: currentYear - chartYearRange }, (_, i) =>
    (chartYearRange + i).toString(),
  )

  const statConfig = labels.map((label, i) => ({
    name: label,
    pe: financials.at(-1 - i)?.priceEarningsRatio ?? undefined,
    pb: financials.at(-1 - i)?.priceToBookRatio ?? undefined,
    ps: financials.at(-1 - i)?.priceToSalesRatio ?? undefined,
  }))

  const marginConfig = labels.map((label, i) => ({
    name: label,
    gm: financials.at(-1 - i)?.grossProfitMargin ?? undefined,
    om: financials.at(-1 - i)?.operatingProfitMargin ?? undefined,
    pm: financials.at(-1 - i)?.netProfitMargin ?? undefined,
  }))

  const dividendConfig = labels.map((label, i) => ({
    name: label,
    div: financials.at(-1 - i)?.dividendYield ?? undefined,
  }))

  return (
    <div className="f-col grid-cols-2 gap-6 py-3 sm:gap-8 sm:py-6 md:grid">
      <div className="f-col items-center gap-1">
        <MetricsChart data={statConfig} />
        <p className="text-sm text-gray-400">
          Key Metrics for {stock.companyName}
        </p>
      </div>
      <div className="f-col items-center gap-1">
        <MarginChart data={marginConfig} />
        <p className="text-sm text-gray-400">Margins for {stock.companyName}</p>
      </div>
      <div className="f-col items-center gap-1">
        <DividendChart data={dividendConfig} />
        <p className="text-sm text-gray-400">
          Dividend Yield for {stock.companyName}
        </p>
      </div>
    </div>
  )
}
