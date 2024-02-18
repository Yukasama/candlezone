import PortfolioCard from "@/app/(portfolio)/portfolio/portfolio-card";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import PageLayout from "@/components/shared/page-layout";
import { PLANS } from "@/config/stripe";
import { Suspense } from "react";
import { Card, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

export const metadata = { title: "My Portfolios" };
// export const runtime = "edge";

const PortfolioCreateCard = dynamic(() => import("./portfolio-create-card"), {
  ssr: false,
  loading: () => (
    <Card className="h-[340px] f-box">
      <Spinner />
    </Card>
  ),
});

export default async function page() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      isPublic: true,
      createdAt: true,
      color: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { userId: user?.id },
  });

  return (
    <PageLayout title="My Portfolios" description="Manage your portfolios here">
      <div className="f-col gap-6 md:grid md:grid-cols-2 xl:gap-8 xl:grid-cols-3 grid-auto-rows:max-content">
        {/* Portfolio Cards */}
        {portfolios.map((portfolio) => (
          <Suspense
            key={portfolio.id}
            fallback={<Card className="animate-pulse-right h-[340px]" />}>
            <PortfolioCard portfolio={portfolio} />
          </Suspense>
        ))}

        {/* Create Card + Modal */}
        {portfolios.length < PLANS[0].maxPortfolios && (
          <PortfolioCreateCard numberOfPortfolios={portfolios.length} />
        )}
      </div>
    </PageLayout>
  );
}
