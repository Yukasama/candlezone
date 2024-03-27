import PortfolioItem from "@/components/portfolio/portfolio-item";
import StockImage from "@/components/stock/stock-image";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { getQuotes } from "@/lib/fmp/quote/quote";
import { ArrowBigDown, ArrowBigUp, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { getRecentStocksByUserId } from "@/lib/data/stock";
import dynamic from "next/dynamic";
import { Button, buttonVariants } from "@/components/ui/button";

const AddStockPortfolio = dynamic(
  () => import("@/components/stock/add-stock-portfolio"),
  {
    ssr: false,
    loading: () => <Button size="icon" variant="secondary" isLoading />,
  }
);

export const metadata = { title: "Dashboard" };
// export const runtime = "edge";

export default async function page() {
  const user = await getUser();

  const [stocks, portfolios] = await Promise.all([
    getRecentStocksByUserId(user?.id, 12),
    db.portfolio.findMany({
      include: {
        stocks: {
          select: {
            stockId: true,
            stock: {
              select: { symbol: true, image: true, companyName: true },
            },
          },
        },
      },
      where: { userId: user?.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const quotes = await getQuotes(stocks.map((stock) => stock.stock.symbol));
  const stockQuotes = stocks.map((stock) => ({
    ...stock.stock,
    ...quotes?.find((q) => q.symbol === stock.stock.symbol)!,
  }));

  return (
    <div className="f-col lg:grid grid-cols-4">
      <div className="f-col bg-zinc-200/40 dark:bg-zinc-800/20 p-8 gap-4">
        <div className="flex justify-between">
          <h3 className="font-medium text-xl">My Portfolios</h3>
          <Button>
            <Plus size={16} />
            <p className="text-[13px]">Create new</p>
          </Button>
        </div>
        <div className="f-col gap-2.5">
          {portfolios.length ? (
            portfolios.map((portfolio) => (
              <Link
                href={`/p/${portfolio.id}`}
                className="flex bg-zinc-50 dark:bg-zinc-950 justify-between items-center p-2.5 px-4 text-sm shadow-sm shadow-zinc-200 dark:shadow-zinc-800 rounded-md hover:bg-zinc-200/80 dark:hover:bg-zinc-950/60"
                key={portfolio.id + 1}>
                <PortfolioItem portfolio={portfolio} />
                <div className="grid grid-cols-4 gap-1">
                  {portfolio.stocks.slice(0, 8).map((stock) => (
                    <StockImage
                      key={stock.stock.symbol}
                      src={stock.stock.image}
                      px={27}
                    />
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-zinc-400">No portfolios created yet.</p>
          )}
        </div>
      </div>
      <div className="f-col gap-4 col-span-2 p-8 border-x-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-xl">Recent Activity</h3>
          <Link href="/" className={buttonVariants({ size: "sm" })}>
            <ExternalLink size={16} />
            <p className="text-[13px]">View stocks</p>
          </Link>
        </div>
        <div className="f-col gap-4 overflow-y-auto h-[500px] lg:h-screen">
          {stockQuotes.length ? (
            stockQuotes.map((stock) => (
              <div
                key={stock.symbol + 2}
                className="f-col p-5 shadow-sm shadow-zinc-200 dark:shadow-zinc-800 rounded-md gap-4">
                <div className="flex justify-between items-center gap-1">
                  <div className="flex items-center gap-4">
                    <StockImage src={stock.image} px={50} />
                    <div>
                      <p className="text-base font-semibold">
                        {stock.companyName}
                      </p>
                      <p className="font-semibold text-zinc-500 text-sm">
                        {stock.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="f-col items-end">
                    <p className="font-semibold">${stock.price?.toFixed(2)}</p>
                    <div className="font-semibold text-sm flex items-center gap-0.5">
                      {stock.changesPercentage > 0 ? (
                        <ArrowBigUp size={16} className="text-price-up" />
                      ) : (
                        <ArrowBigDown size={16} className="text-price-down" />
                      )}
                      <span
                        className={`${
                          stock.changesPercentage > 0
                            ? "text-price-up"
                            : "text-price-down"
                        }`}>
                        {stock.changesPercentage?.toFixed(2).replace("-", "")}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex text-sm gap-4 md:gap-6">
                    <div className="f-col">
                      <p className="text-zinc-400">Sector</p>
                      {stock.sector}
                    </div>
                    <div className="f-col">
                      <p className="text-zinc-400">P/E Ratio</p>
                      {stock.peRatioTTM?.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-2 items-end">
                    <AddStockPortfolio stock={stock} portfolios={portfolios} />
                    <Link
                      className={buttonVariants({
                        variant: "secondary",
                        size: "icon",
                      })}
                      href={`/stocks/${stock.symbol}`}>
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-400">No recent activity.</p>
          )}
        </div>
      </div>
      <div className="hidden lg:f-col"></div>
    </div>
  );
}
