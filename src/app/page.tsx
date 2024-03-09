import { getDailys } from "@/lib/fmp/quote";
import { SITE } from "@/config/site";
import { db } from "@/db";
import PageLayout from "@/components/shared/page-layout";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import StockPageItem from "./stock-page-item";
import { getUser } from "@/lib/auth";
import LandingTable from "./landing-table";
import { getMarketCap } from "@/lib/fmp/profile";

export const metadata = { title: `Stock Research & Analysis | ${SITE.name}` };
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

  const activities = [
    {
      title: "Most Active",
      stocks: actives,
    },
    {
      title: "Daily Winners",
      stocks: winners,
    },
    {
      title: "Daily Losers",
      stocks: losers,
    },
  ];

  return (
    <PageLayout className="f-col gap-10 md:mx-8 lg:mx-16 xl:mx-24">
      {/* Features */}
      <div className="justify-between hidden lg:flex gap-4">
        {activities.map((activity) => (
          <Card key={activity.title} className="flex-1 px-2">
            <CardHeader className="font-semibold text-lg">
              {activity.title}
            </CardHeader>
            <CardBody className="f-col gap-2">
              {activity.stocks?.slice(0, 3).map((stock) => (
                <StockPageItem key={stock.symbol} quote={stock} />
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      {stocks && (
        <LandingTable stocks={stocks} isAuth={!!user} portfolios={portfolios} />
      )}
    </PageLayout>
  );
}
