import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { Suspense } from "react";
import { PortfolioItem } from "./portfolio-item";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Portfolio Settings" };

export default async function page() {
  const user = await getUser();

  const portfolios = await db.portfolio.findMany({
    where: { userId: user?.id },
  });

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Your Portfolios</h2>
        <Separator />
      </div>

      <Suspense fallback={<Skeleton className="w-full" />}>
        {portfolios.map((portfolio) => (
          <PortfolioItem key={portfolio.id} portfolio={portfolio} />
        ))}
      </Suspense>
    </div>
  );
}
