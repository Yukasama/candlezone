import { db } from '@/lib/db'
import { Separator } from '@/components/ui/separator'
import Statistics, {
  StatisticsLoading,
} from '@/components/stock/symbol/statistics'
import PriceChart from '@/components/stock/symbol/price-chart'
import { StockImage } from '@/components/stock/stock-image'
import { getUser } from '@/lib/auth'
import { getQuote } from '@/lib/fmp/quote/quote'
import { Chip } from '@nextui-org/chip'
import Link from 'next/link'
import Price from '@/components/stock/symbol/price'
import AIMetric from '@/components/stock/symbol/ai-metric'
import Valuation from '../../../../components/stock/symbol/valuation'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getStockRatios } from '@/lib/fmp/info/get-stock-ratios'
import { getPortfoliosByUserId } from '@/utils/queries/portfolio'
import { Button } from '@/components/ui/button'
import { Loader, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { isSymbolValid } from '@/utils/utils'
import { addToRecentStocks } from '@/utils/queries/stock'

const AddStockPortfolio = dynamic(
  () => import('@/components/stock/add-stock-portfolio'),
  {
    ssr: false,
    loading: () => (
      <Button size="icon" isLoading>
        <Plus size={18} />
      </Button>
    ),
  }
)

interface Props {
  params: { symbol: string }
}

export async function generateStaticParams() {
  const data = await db.stock.findMany({
    select: { symbol: true },
    where: {
      symbol: { not: { contains: '.' } },
      isEtf: false,
      isFund: false,
      isActivelyTrading: true,
      exchange: { not: 'Other OTC' },
    },
  })

  const filteredData = data.filter(({ symbol }) => isSymbolValid(symbol))
  return filteredData.map((stock) => ({ symbol: stock.symbol }))
}

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
    getStockRatios(symbol),
    getPortfoliosByUserId(user?.id),
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

  const aiMetrics = [
    {
      title: 'Fundamental',
      gradient: ['#fda37a', '#ffcc5e'],
      value: 67,
      tooltip:
        'The Fundamental-Analysis-Score (FAS) based on financial reports, forecasting earnings and market position.',
    },
    {
      title: 'Shark4',
      gradient: ['#47FCA7', '#00FFDE'],
      value: 78,
      tooltip:
        "Shark4 offers an estimate of a company's overall health, combining profitability, liquidity, and solvency ratios.",
    },
    {
      title: 'Technical',
      gradient: ['#0088FF', '#5947FC'],
      value: 94,
      tooltip:
        'The Technical-Analysis-Score (TAS) derived from historical trading activity and stock price movements.',
    },
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
                    <Chip
                      key={attribute.name}
                      as={Link}
                      prefetch={false}
                      href={`/?${attribute.name}=${attribute.value}`}
                      size="sm"
                      classNames={{
                        base: 'bg-gradient-to-br from-orange-500 to-amber-500 border-small border-white/50 shadow-orange-500/30',
                        content: 'drop-shadow shadow-black text-white',
                      }}
                    >
                      {attribute.value}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <Suspense fallback={<Loader size={18} className="animate-spin" />}>
              <Price stock={stock} className="flex md:hidden" />
            </Suspense>

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
            <Suspense fallback={<Loader size={18} className="animate-spin" />}>
              <Price stock={stock} className="hidden md:flex" />
            </Suspense>
            <Valuation stock={stock} className="hidden md:flex" />
          </div>
        </div>

        <PriceChart symbol={symbol} className="-mt-5 md:mt-0" />
        <Valuation stock={stock} className="flex md:hidden" />

        <div className="f-col gap-1">
          <h2 className="font-light text-xl md:text-2xl">Statistics</h2>
          <Separator />
          <Suspense fallback={<StatisticsLoading />}>
            <Statistics stock={stock} />
          </Suspense>
        </div>

        <div className="f-col gap-1">
          <h2 className="font-light text-xl md:text-2xl">About</h2>
          <Separator />
        </div>

        <div className="p-4 line-clamp-3">
          <p className="line-clamp-3">{stock.description}</p>
        </div>
      </div>

      <div className="col-span-1"></div>
    </div>
  )
}
