import Link from "next/link";
import StockList from "@/components/stock/stock-list";
import { Suspense } from "react";
import { PortfolioWithStocks } from "@/types/db";
import { db } from "@/db";
import { ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import PortfolioImage from "@/components/portfolio/portfolio-image";
import { SkeletonList } from "@/components/ui/skeleton";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

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
    loading: () => <Button isLoading isIconOnly color="primary" />,
  }
);

const PortfolioDeleteModal = dynamic(
  () => import("@/components/portfolio/portfolio-delete-modal"),
  {
    ssr: false,
    loading: () => <Button isLoading isIconOnly className="bg-red-500" />,
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
            <p className="text-lg">{portfolio.title}</p>
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
            color="secondary"
            startContent={<ExternalLink size={18} />}
            aria-label="View portfolio"
          />
          <PortfolioAddModal portfolio={portfolio} />
          <PortfolioDeleteModal portfolio={portfolio} />
        </div>
      </CardHeader>

      <Divider />

      <CardBody>
        <Suspense fallback={<SkeletonList />}>
          <StockList
            symbols={symbols.map((s) => s.symbol)}
            error="No Stocks in this Portfolio"
            className="group-hover:scale-[1.01] duration-300 border-none"
            limit={3}
          />
        </Suspense>
      </CardBody>
    </Card>
  );
}
