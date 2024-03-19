import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import Statistics, {
  StatisticsLoading,
} from "@/app/(stock)/stocks/[symbol]/statistics";
import PriceChart from "@/app/(stock)/stocks/[symbol]/price-chart";
import StockImage from "@/components/stock/stock-image";
import { getUser } from "@/lib/auth";
import { getQuote } from "@/lib/fmp/quote/quote";
import { Card, Chip, Spinner } from "@nextui-org/react";
import Link from "next/link";
import Price from "@/app/(stock)/stocks/[symbol]/price";
import AIMetric from "@/app/(stock)/stocks/[symbol]/ai-metric";
import Valuation from "./valuation";
import { Suspense } from "react";
import AddStockPortfolioWrapper from "@/components/stock/add-stock-portfolio-wrapper";
import { getLatestStockById } from "@/lib/data/stock";
import { notFound } from "next/navigation";

interface Props {
  params: { symbol: string };
}

export async function generateStaticParams() {
  const data = await db.stock.findMany({
    select: { symbol: true },
  });

  return data.map((stock) => ({ symbol: stock.symbol }));
}

export async function generateMetadata({ params: { symbol } }: Props) {
  const quote = await getQuote(symbol);

  const change = quote?.changesPercentage ?? "N/A";
  const pos = change !== "N/A" ? change > 0 : true;
  const direction = pos ? "▲" : "▼";

  return {
    title: `${quote?.symbol} ${quote?.price?.toFixed(2)} ${direction} ${
      pos ? "+" : ""
    }${quote?.changesPercentage?.toFixed(2)}%`,
  };
}

export default async function page({ params: { symbol } }: Props) {
  const [user, stock] = await Promise.all([
    getUser(),
    getLatestStockById(symbol),
  ]);

  if (!stock) {
    return notFound();
  }

  // Add stock to user's recent stocks
  if (user) {
    const oneMinuteAgo = new Date(new Date().getTime() - 60000);
    const recentEntry = await db.userRecentStocks.count({
      where: {
        userId: user.id,
        stockId: stock.id,
        createdAt: { gte: oneMinuteAgo },
      },
    });

    if (!recentEntry) {
      await db.userRecentStocks.create({
        data: {
          userId: user.id,
          stockId: stock.id,
        },
      });
    }
  }

  const attributes = [
    { name: "sector", value: stock.sector },
    { name: "industry", value: stock.industry },
    { name: "country", value: stock.country },
  ];

  const aiMetrics = [
    {
      title: "Fundamental",
      gradient: ["#fda37a", "#ffcc5e"],
      value: 67,
      tooltip:
        "The Fundamental-Analysis-Score (FAS) based on financial reports, forecasting earnings and market position.",
    },
    {
      title: "Shark4",
      gradient: ["#47FCA7", "#00FFDE"],
      value: 78,
      tooltip:
        "Shark4 offers an estimate of a company's overall health, combining profitability, liquidity, and solvency ratios.",
    },
    {
      title: "Technical",
      gradient: ["#0088FF", "#5947FC"],
      value: 94,
      tooltip:
        "The Technical-Analysis-Score (TAS) derived from historical trading activity and stock price movements.",
    },
  ];

  return (
    <div className="f-col xl:grid grid-cols-5 gap-8 mx-6 md:mx-10 xl:m-12">
      <div></div>
      <div className="col-span-3 f-col gap-7 md:gap-8">
        <div className="f-col gap-6">
          <div className="f-col gap-5 sm:gap-2">
            <div className="f-col md:flex-row justify-between gap-5">
              <div className="flex gap-3 sm:gap-5">
                <Link
                  className="-ml-3"
                  href={`${stock.website}`}
                  prefetch={false}
                  target="_blank">
                  <StockImage src={stock.image} priority px={92} />
                </Link>
                <div>
                  <div className="flex gap-3">
                    <p className="font-semibold text-[21px] md:text-2xl truncate max-w-[230px]">
                      {stock.companyName}
                    </p>
                    <Suspense fallback={<Spinner />}>
                      <AddStockPortfolioWrapper stock={stock} user={user} />
                    </Suspense>
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
                          base: "bg-gradient-to-br from-primary to-amber-500 border-small border-white/50 shadow-primary/30",
                          content: "drop-shadow shadow-black text-white",
                        }}>
                        {attribute.value}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              <Suspense fallback={<Spinner />}>
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
          </div>

          <div className="f-col md:flex-row gap-6 md:items-center justify-between sm:px-0.5">
            <Suspense fallback={<Spinner />}>
              <Price stock={stock} className="hidden md:flex" />
            </Suspense>
            <Valuation stock={stock} className="hidden md:flex" />
          </div>
        </div>

        <div className="-mt-6">
          <PriceChart symbol={symbol} />
        </div>
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

        <Card className="p-4 line-clamp-3">
          <p className="line-clamp-3">{stock.description}</p>
        </Card>
      </div>

      <div className="col-span-1"></div>
    </div>
  );
}
