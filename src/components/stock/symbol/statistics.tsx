import MarginChart from './margin-chart'
import { Stock } from '@prisma/client'
import { db } from '@/lib/db'
import MetricsChart from './metrics-chart'
import DividendChart from './dividend-chart'

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
    return null
  }

  const currentYear = new Date().getFullYear()
  const startYear = currentYear - financials.length
  const chartYearRange = Math.max(2015, startYear)

  const labels = Array.from({ length: currentYear - chartYearRange }, (_, i) =>
    (chartYearRange + i).toString()
  )

  const statConfig = labels.map((label, i) => ({
    name: label,
    pe: financials[financials.length - 1 - i].priceEarningsRatio,
    pb: financials[financials.length - 1 - i].priceToBookRatio,
    ps: financials[financials.length - 1 - i].priceToSalesRatio,
  }))

  const marginConfig = labels.map((label, i) => ({
    name: label,
    gm: financials[financials.length - 1 - i].grossProfitMargin,
    om: financials[financials.length - 1 - i].operatingProfitMargin,
    pm: financials[financials.length - 1 - i].netProfitMargin,
  }))

  const dividendConfig = labels.map((label, i) => ({
    name: label,
    div: financials[financials.length - 1 - i].dividendYield,
  }))

  return (
    <div className="f-col md:grid grid-cols-2 gap-6 sm:gap-8 py-3 sm:py-6">
      <div className="f-col items-center gap-1">
        <MetricsChart data={statConfig} />
        <p className="text-sm text-slate-400">
          Key Metrics for {stock.companyName}
        </p>
      </div>
      <div className="f-col items-center gap-1">
        <MarginChart data={marginConfig} />
        <p className="text-sm text-slate-400">
          Margins for {stock.companyName}
        </p>
      </div>
      <div className="f-col items-center gap-1">
        <DividendChart data={dividendConfig} />
        <p className="text-sm text-slate-400">
          Dividend Yield for {stock.companyName}
        </p>
      </div>
    </div>
  )
}
