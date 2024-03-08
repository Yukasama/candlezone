import { getDailys } from "@/lib/fmp/quote";
import { SITE } from "@/config/site";
import { db } from "@/db";
import PageLayout from "@/components/shared/page-layout";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import StockPageItem from "./stock-page-item";
import { getUser } from "@/lib/auth";
import LandingTable from "./landing-table";
import { getMarketCap } from "@/lib/fmp/marketCap";

export const metadata = { title: `Stock Research & Analysis | ${SITE.name}` };
export const revalidate = 5;
// export const runtime = "edge";

export default async function page() {
  const user = await getUser();

  const [portfolios, stocks, actives, winners, losers] = await Promise.all([
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
    getMarketCap(),
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
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

      {stocks && (
        <LandingTable stocks={stocks} isAuth={!!user} portfolios={portfolios} />
      )}
    </PageLayout>
  );
}
