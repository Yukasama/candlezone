import { StockListLoading } from "@/components/stock/stock-list";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { Suspense } from "react";
import PortfolioItem from "./portfolio-item";

export const metadata = { title: "Portfolio Settings" };

export default async function page() {
  const user = await getUser();

  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
      createdAt: true,
    },
    where: { userId: user?.id },
  });

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Your Portfolios</h2>
        <Separator />
      </div>

      <Suspense fallback={<StockListLoading className="w-full" />}>
        {portfolios.map((portfolio) => (
          <PortfolioItem key={portfolio.id} portfolio={portfolio} />
        ))}
      </Suspense>
    </div>
  );
}
