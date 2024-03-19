import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PortfolioAllocation from "@/app/(portfolio)/p/[id]/portfolio-allocation";
import { getStockQuotes } from "@/lib/fmp/quote/quote";
import PortfolioChart from "./portfolio-chart";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/react";

interface Props {
  params: { id: string };
}

const PortfolioAssets = dynamic(
  () => import("@/app/(portfolio)/p/[id]/portfolio-assets"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default async function page({ params: { id } }: Props) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      id: true,
      title: true,
      userId: true,
      isPublic: true,
      createdAt: true,
      stocks: {
        select: {
          stockId: true,
          stock: {
            select: {
              symbol: true,
              companyName: true,
              image: true,
              peRatioTTM: true,
              sector: true,
            },
          },
        },
      },
    },
    where: { id },
  });

  if (!portfolio) {
    return notFound();
  }

  const stockQuotes = await getStockQuotes(
    portfolio.stocks.map((s) => s.stock)
  );

  return (
    <div className="f-col gap-6">
      <PortfolioChart portfolio={{ id: portfolio.id }} />
      <div className="f-col xl:flex-row gap-6">
        <PortfolioAllocation stocks={portfolio.stocks.map((s) => s.stock)} />
        <PortfolioAssets stockQuotes={stockQuotes} portfolio={portfolio} />
      </div>
    </div>
  );
}
