import { getDailys } from "@/lib/fmp/quote/dailys";
import { SITE } from "@/config/site";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StockPageItem from "./stock-page-item";
import { getUser } from "@/lib/auth";
import { getMarketCap } from "@/lib/fmp/profile";
import { getPortfoliosByUserId } from "@/lib/data/portfolio";
import LandingTable from "./landing-table";

export const metadata = { title: `Stock Research & Analysis | ${SITE.name}` };

export default async function page() {
  const user = await getUser();

  const [portfolios, stocks, actives, winners, losers] = await Promise.all([
    getPortfoliosByUserId(user?.id),
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
    <div className="f-col gap-10 m-6 md:mx-8 lg:mx-16 xl:mx-24">
      {/* Features */}
      <div className="justify-between hidden lg:flex gap-4">
        {activities.map((activity) => (
          <Card key={activity.title} className="flex-1 px-2">
            <CardHeader className="font-semibold text-lg">
              {activity.title}
            </CardHeader>
            <CardContent className="f-col gap-2">
              {activity.stocks?.slice(0, 3).map((stock) => (
                <StockPageItem key={stock.symbol} quote={stock} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
