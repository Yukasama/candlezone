import { getDailys } from "@/lib/fmp/quote/dailys";
import { SITE } from "@/config/site";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StockPageItem from "./stock-page-item";
import { getUser } from "@/lib/auth";
import { getPortfoliosByUserId } from "@/lib/data/portfolio";
import { db } from "@/lib/db";
import { getStockQuotes } from "@/lib/fmp/quote/quote";
import LandingTablee from "./landing-tablee";

export const metadata = { title: `Stock Research & Analysis | ${SITE.name}` };

export default async function page() {
  const user = await getUser();
  const [portfolios, stocks, actives, winners, losers] = await Promise.all([
    getPortfoliosByUserId(user?.id),
    db.stock.findMany({
      select: {
        symbol: true,
        companyName: true,
        image: true,
        sector: true,
        mktCap: true,
        isEtf: true,
        isFund: true,
        isActivelyTrading: true,
      },
      where: {
        symbol: { not: { in: ["GOOGL"] } },
        isEtf: false,
        isFund: false,
        isActivelyTrading: true,
        exchange: { not: "Other OTC" },
      },
      orderBy: { mktCap: "desc" },
      take: 500,
    }),
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  const stockQuotes = await getStockQuotes(stocks);
  const stocksWithRank = stockQuotes.map((stock, i) => ({
    ...stock,
    rank: i + 1,
  }));

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
          <Card
            key={activity.title}
            className="flex-1 px-2 bg-background border">
            <CardHeader className="font-semibold text-lg">
              {activity.title}
            </CardHeader>
            <CardContent className="f-col gap-2">
              {activity.stocks?.slice(0, 3).map((stock: any) => (
                <StockPageItem key={stock.symbol} quote={stock} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {stocksWithRank && (
        <LandingTablee stocks={stocksWithRank} portfolios={portfolios} />
      )}
    </div>
  );
}
