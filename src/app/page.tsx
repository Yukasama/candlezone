import CompanyLogo from "@/components/shared/company-logo";
import { getDailys, getStockQuotes } from "@/lib/fmp/quote";
import { SITE } from "@/config/site";
import { db } from "@/db";
import PageLayout from "@/components/shared/page-layout";
import Shimmer from "@/components/ui/shimmer";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import StockPageItem from "./stock-page-item";
import { getUser } from "@/lib/auth";
import dynamic from "next/dynamic";
import { SkeletonList } from "@/components/ui/skeleton";

const LandingTable = dynamic(() => import("./landing-table"), {
  ssr: false,
  loading: () => <SkeletonList count={10} />,
});

export const metadata = { title: `Stock Research & Analysis | ${SITE.name}` };
// export const runtime = "edge";

export default async function page() {
  const [user, stocks, actives, winners, losers] = await Promise.all([
    getUser(),
    db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        companyName: true,
        image: true,
        sector: true,
        industry: true,
        country: true,
        exchange: true,
        marketCapTTM: true,
      },
      where: {
        symbol: {
          not: { in: ["GOOGL"] },
        },
      },
      orderBy: {
        marketCapTTM: "desc",
      },
      take: 400,
    }),
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  const [portfolios, stockQuotes] = await Promise.all([
    db.portfolio.findMany({
      select: {
        id: true,
        title: true,
        color: true,
        isPublic: true,
        stocks: {
          select: { stockId: true },
        },
      },
      where: { userId: user?.id },
    }),
    getStockQuotes(stocks),
  ]);

  return (
    <PageLayout className="f-col gap-10 md:mx-8 lg:mx-16 xl:mx-24">
      {/* Header */}
      <div>
        <h1 className="text-base lg:text-xl xl:text-2xl font-bold font-[Arial]">
          Current Market Cap Rankings of Today&apos;s Stock Prices.
        </h1>
        <h3 className="text-sm lg:text-base text-zinc-400">
          Stay informed with today&apos;s stock market cap rankings, providing a
          quick snapshot of current stock price trends.
        </h3>
      </div>

      {/* Features */}
      <div className="justify-between hidden lg:flex gap-4">
        <Card className="flex-1 px-2">
          <CardHeader className="font-semibold text-lg">Most Active</CardHeader>
          <CardBody className="f-col gap-2">
            {actives?.slice(0, 3).map((stock) => (
              <StockPageItem key={stock.symbol} quote={stock} />
            ))}
          </CardBody>
        </Card>
        <Card className="flex-1 px-2">
          <CardHeader className="font-semibold text-lg">
            Daily Winners
          </CardHeader>
          <CardBody className="f-col gap-2">
            {winners?.slice(0, 3).map((stock) => (
              <StockPageItem key={stock.symbol} quote={stock} />
            ))}
          </CardBody>
        </Card>
        <Card className="flex-1 px-2">
          <CardHeader className="font-semibold text-lg">
            Daily Losers
          </CardHeader>
          <CardBody className="f-col gap-2">
            {losers?.slice(0, 3).map((stock) => (
              <StockPageItem key={stock.symbol} quote={stock} />
            ))}
          </CardBody>
        </Card>
      </div>

      <LandingTable
        stockQuotes={stockQuotes}
        isAuth={!!user}
        portfolios={portfolios}
      />

      {/* Background Effects */}
      <Shimmer />
      <div className="fixed pointer-events-none top-0">
        <div
          aria-hidden="true"
          className="inset-x-0 blur-xl opacity-0 dark:opacity-10 -z-0">
          <CompanyLogo px={1000} />
        </div>
      </div>
    </PageLayout>
  );
}
