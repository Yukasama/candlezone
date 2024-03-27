import Link from "next/link";
import StockList from "@/components/stock/stock-list";
import { Suspense } from "react";
import { PortfolioWithStocks } from "@/types/portfolio";
import { db } from "@/lib/db";
import { ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import PortfolioImage from "@/components/portfolio/portfolio-image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import ChangeTitle from "../p/[id]/change-title";
import { Separator } from "@/components/ui/separator";

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "isPublic" | "color" | "stocks"
  >;
}

const PortfolioAddModal = dynamic(
  () => import("@/components/portfolio/portfolio-add-modal"),
  {
    ssr: false,
    loading: () => <Button isLoading isIconOnly size="sm" color="primary" />,
  }
);

const PortfolioDeleteModal = dynamic(
  () => import("@/components/portfolio/portfolio-delete-modal"),
  {
    ssr: false,
    loading: () => (
      <Button isLoading isIconOnly size="sm" className="bg-red-500" />
    ),
  }
);

export default async function PortfolioCard({ portfolio }: Props) {
  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: {
      id: {
        in: portfolio.stocks.map((stock) => stock.stockId),
      },
    },
  });

  return (
    <Card className="h-[340px] f-col justify-between">
      <CardHeader className="px-4 justify-between">
        <div className="flex items-center gap-3">
          <PortfolioImage portfolio={portfolio} />
          <div>
            <ChangeTitle
              portfolio={portfolio}
              className="bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-950"
            />
            <p className="text-sm text-zinc-500">
              {portfolio.isPublic ? "Public" : "Private"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            as={Link}
            href={`/p/${portfolio.id}`}
            isIconOnly
            size="sm"
            color="secondary"
            startContent={<ExternalLink size={18} />}
            aria-label="View portfolio"
          />
          <PortfolioAddModal portfolio={portfolio} />
          <PortfolioDeleteModal portfolio={portfolio} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent>
        <Suspense fallback={<Spinner />}>
          <StockList
            symbols={symbols.map((s) => s.symbol)}
            error="No Stocks in this Portfolio"
            className="group-hover:scale-[1.01] duration-300 border-none"
            limit={4}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
