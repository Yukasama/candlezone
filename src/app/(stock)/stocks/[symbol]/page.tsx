import { db } from '@/lib/db'
import { Separator } from '@/components/ui/separator'
import { Statistics } from '@/components/stock/symbol/statistics'
import { PriceChart } from '@/components/stock/symbol/price-chart'
import { StockImage } from '@/components/stock/stock-image'
import { getUser } from '@/lib/auth'
import { getQuote } from '@/lib/fmp/quote/quote'
import Link from 'next/link'
import { Price } from '@/components/stock/symbol/price'
import { AIMetric } from '@/components/stock/symbol/ai-metric'
import { Valuation } from '@/components/stock/symbol/valuation'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getStockRatios } from '@/lib/fmp/info/get-stock-ratios'
import { getPortfoliosByUserId } from '@/utils/queries/portfolio'
import { isSymbolValid } from '@/utils/stock-helper'
import { addToRecentStocks } from '@/utils/queries/stock'
import { Loader } from '@/components/loader'
import { AddStockPortfolio } from '@/components/stock/add-stock-portfolio'
import { aiMetrics } from '@/config/ai-metric'
import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  params: { symbol: string }
}

// export async function generateStaticParams() {
//   const data = await db.stock.findMany({
//     select: { symbol: true },
//   })

//   const filteredData = data.filter(({ symbol }) => isSymbolValid(symbol))
//   return filteredData.map((stock) => ({ symbol: stock.symbol }))
// }

export async function generateMetadata({ params: { symbol } }: Props) {
  if (!isSymbolValid(symbol)) {
    return { title: 'Stock not found' }
  }

  const quote = await getQuote(symbol)
  if (!quote?.changesPercentage) {
    return { title: 'Stock not found' }
  }

  const change = quote.changesPercentage
  const pos = change >= 0
  const direction = pos ? '▲' : '▼'

  return {
    title: `${quote?.symbol} ${quote?.price?.toFixed(2)} ${direction} ${
      pos && '+'
    }${quote?.changesPercentage?.toFixed(2)}%`,
  }
}

export default async function SymbolPage({
  params: { symbol },
}: Readonly<Props>) {
  if (!isSymbolValid(symbol)) {
    return notFound()
  }

  const user = await getUser()
  const [stock, portfolios] = await Promise.all([
    getStockRatios({ symbol }),
    getPortfoliosByUserId({ userId: user?.id }),
  ])

  if (!stock) {
    return notFound()
  }

  // Add stock to user's recent stocks
  if (user) {
    await addToRecentStocks({ userId: user.id, stockId: stock.id })
  }

  const attributes = [
    { name: 'sector', value: stock.sector },
    { name: 'industry', value: stock.industry },
    { name: 'country', value: stock.country },
  ]

  return (
    <div className="f-col xl:grid grid-cols-6 gap-8 mx-6 md:mx-10 xl:m-12">
      <div></div>
      <div className="col-span-4 f-col gap-7">
        <div className="f-col gap-6">
          <div className="f-col md:flex-row justify-between gap-5">
            <div className="flex gap-3 sm:gap-5">
              <Link
                className="-ml-1"
                href={`${stock.website}`}
                prefetch={false}
                target="_blank"
              >
                <StockImage src={stock.image} priority px={92} />
              </Link>
              <div>
                <div className="flex gap-3">
                  <p className="font-semibold text-[21px] md:text-2xl truncate max-w-[230px]">
                    {stock.companyName}
                  </p>
                  <AddStockPortfolio portfolios={portfolios} stock={stock} />
                </div>
                <p className="text-zinc-400">{stock.symbol}</p>
                <div className="flex gap-3 mt-2">
                  {attributes.map((attribute) => (
                    <Link
                      key={attribute.name}
                      prefetch={false}
                      href={`/?${attribute.name}=${attribute.value}`}
                      className={cn(
                        badgeVariants(),
                        attribute.name === 'industry' && 'hidden sm:flex'
                      )}
                    >
                      {attribute.value}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Price stock={stock} className="flex md:hidden" />

            <div className="f-col gap-1">
              <h2 className="font-light text-xl flex md:hidden">
                AI Analytics
              </h2>
              <Separator className="flex md:hidden" />
              <div className="flex items-center gap-5">
                {aiMetrics.map((value) => (
                  <AIMetric
                    key={value.title}
                    user={user}
                    title={value.title}
                    value={value.value}
                    gradient={value.gradient}
                    tooltip={value.tooltip}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="f-col md:flex-row gap-6 md:items-center justify-between sm:px-0.5">
            <Price stock={stock} className="hidden md:flex" />
            <Valuation stock={stock} className="hidden md:flex" />
          </div>
        </div>

        <PriceChart symbol={symbol} className="-mt-5 md:mt-0" />
        <Valuation stock={stock} className="flex md:hidden" />

        {!stock.isEtf && (
          <div className="f-col gap-1">
            <h2 className="font-light text-xl md:text-2xl">Statistics</h2>
            <Separator />
            <Suspense fallback={<Loader />}>
              <Statistics stock={stock} />
            </Suspense>
          </div>
        )}

        <div className="f-col gap-1">
          <h2 className="font-light text-xl md:text-2xl">About</h2>
          <Separator />
          <p className="line-clamp-3 m-2">{stock.description}</p>
        </div>
      </div>

      <div className="col-span-1"></div>
    </div>
  )
}
