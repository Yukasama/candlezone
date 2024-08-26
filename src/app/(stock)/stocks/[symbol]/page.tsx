import { Loader } from '@/components/loader';
import { Price } from '@/components/stock/price';
import { PriceChart } from '@/components/stock/price-chart';
import { StockImage } from '@/components/stock/stock-image';
import { badgeVariants } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { aiMetrics } from '@/config/ai-metric';
import { AddStockPortfolio } from '@/features/stock/add-stock-portfolio';
import { AIMetric } from '@/features/stock/symbol/ai-metric';
import { Statistics } from '@/features/stock/symbol/statistics';
import { Valuation } from '@/features/stock/symbol/valuation';
import { getUser } from '@/lib/auth';
import { getStockRatios } from '@/lib/fmp/info/get-stock-ratios';
import { getQuote } from '@/lib/fmp/quote/quote';
import { cn } from '@/lib/utils';
import { getPortfoliosWithStockIdsByUser } from '@/utils/queries/portfolio';
import { addToRecentStocks } from '@/utils/queries/stock';
import { isSymbolValid } from '@/utils/stock-helper';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: { symbol: string };
}

// export const generateStaticParams = async () => {
//   const data = await db.stock.findMany({
//     select: { symbol: true },
//   })

//   const filteredData = data.filter(({ symbol }) => isSymbolValid(symbol))
//   return filteredData.map((stock) => ({ symbol: stock.symbol }))
// }

export const generateMetadata = async ({ params: { symbol } }: Props) => {
  if (!isSymbolValid(symbol)) {
    return { title: 'Stock not found' };
  }

  const quote = await getQuote({ symbol });
  if (!quote?.changesPercentage) {
    return { title: 'Stock not found' };
  }

  const change = quote.changesPercentage;
  const pos = change >= 0;
  const direction = pos ? '▲' : '▼';

  return {
    title: `${quote?.symbol} ${quote?.price?.toFixed(2)} ${direction} ${
      pos ? '+' : ''
    }${quote?.changesPercentage?.toFixed(2)}%`,
  };
};

export default async function SymbolPage({
  params: { symbol },
}: Readonly<Props>) {
  if (!isSymbolValid(symbol)) {
    return notFound();
  }

  const user = await getUser();
  const [stock, portfolios] = await Promise.all([
    getStockRatios({ symbol }),
    getPortfoliosWithStockIdsByUser({ userId: user?.id }),
  ]);

  if (!stock) {
    return notFound();
  }

  if (user) {
    await addToRecentStocks({ userId: user.id, stockId: stock.id });
  }

  const attributes = [
    { name: 'sector', value: stock.sector },
    { name: 'industry', value: stock.industry },
    { name: 'country', value: stock.country },
  ];

  return (
    <div className="f-col mx-6 grid-cols-6 gap-8 md:mx-10 xl:m-12 xl:grid">
      <div></div>
      <div className="f-col col-span-4 gap-7">
        <div className="f-col gap-6">
          <div className="f-col justify-between gap-5 md:flex-row">
            <div className="flex gap-3 sm:gap-5">
              <Link
                className={cn('-ml-1', !stock.website && 'pointer-events-none')}
                href={stock.website ?? ''}
                prefetch={false}
                aria-label="Company Website"
                target="_blank"
              >
                <StockImage src={stock.image} priority px={92} />
              </Link>
              <div>
                <div className="flex gap-3">
                  <p className="max-w-[230px] truncate text-[21px] font-semibold md:text-2xl">
                    {stock.companyName}
                  </p>
                  <AddStockPortfolio
                    portfolios={portfolios}
                    stock={stock}
                    user={user}
                  />
                </div>
                <p className="text-gray-400">{stock.symbol}</p>
                <div className="mt-2 flex gap-1.5">
                  {attributes.map((attribute) => (
                    <Link
                      key={attribute.name}
                      prefetch={false}
                      href={`/?${attribute.name}=${attribute.value}`}
                      className={cn(
                        badgeVariants(),
                        attribute.name === 'industry' && 'hidden sm:flex',
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
              <h2 className="flex text-xl font-light md:hidden">
                AI Analytics
              </h2>
              <Separator className="flex md:hidden" />
              <div className="f-center gap-5">
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

          <div className="f-col justify-between gap-6 sm:px-0.5 md:flex-row md:items-center">
            <Price stock={stock} className="hidden md:flex" />
            <Valuation stock={stock} className="hidden md:flex" />
          </div>
        </div>

        <PriceChart symbol={symbol} className="-mt-5 md:mt-0" />
        <Valuation stock={stock} className="flex md:hidden" />

        {!stock.isEtf && (
          <div className="f-col gap-1">
            <h2 className="text-xl font-light md:text-2xl">Statistics</h2>
            <Separator />
            <Suspense fallback={<Loader />}>
              <Statistics stock={stock} />
            </Suspense>
          </div>
        )}

        <div className="f-col gap-1">
          <h2 className="text-xl font-light md:text-2xl">About</h2>
          <Separator />
          <p className="m-2 line-clamp-3">{stock.description}</p>
        </div>
      </div>

      <div className="col-span-1"></div>
    </div>
  );
}
