"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { PortfolioWithStocks } from "@/types/db";
import { trpc } from "@/trpc/client";
import PortfolioImage from "../portfolio/portfolio-image";
import { Stock } from "@prisma/client";
import { Plus, X } from "lucide-react";

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "color" | "isPublic" | "stocks"
  >;
  stock: Pick<Stock, "id">;
}

export default function AddStockPortfolioItem({ portfolio, stock }: Props) {
  const router = useRouter();

  const inPortfolio = portfolio.stocks.map((s) => s.stockId).includes(stock.id);

  const { mutate: addToPortfolio, isLoading: isAddLoading } =
    trpc.portfolio.add.useMutation({
      onError: () => toast.error("Failed to add to portfolio."),
      onSuccess: () => router.refresh(),
    });

  const { mutate: removeFromPortfolio, isLoading: isRemoveLoading } =
    trpc.portfolio.remove.useMutation({
      onError: () => toast.error("Failed to remove from portfolio."),
      onSuccess: () => router.refresh(),
    });

  return (
    <div className="flex justify-between items-center p-1.5 px-2">
      <div className="flex items-center gap-3">
        <PortfolioImage portfolio={portfolio} />
        <div>
          <p className="w-[180px] truncate font-semibold">{portfolio.title}</p>
          <p className="text-zinc-400 text-[13px]">
            {portfolio.isPublic ? "Public" : "Private"}
          </p>
        </div>
      </div>

      <Button
        onClick={() =>
          inPortfolio
            ? removeFromPortfolio({
                portfolioId: portfolio.id,
                stockIds: [stock.id],
              })
            : addToPortfolio({
                portfolioId: portfolio.id,
                positions: [
                  {
                    stockId: stock.id,
                    price: 0,
                    quantity: 1,
                    date: new Date().toISOString(),
                  },
                ],
              })
        }
        isIconOnly
        size="sm"
        className="text-white"
        color={inPortfolio ? "danger" : "success"}
        isLoading={inPortfolio ? isRemoveLoading : isAddLoading}
        disabled={inPortfolio ? isRemoveLoading : isAddLoading}
        aria-label={inPortfolio ? "Remove from portfolio" : "Add to portfolio"}>
        {(inPortfolio ? !isRemoveLoading : !isAddLoading) &&
          (inPortfolio ? <X size={18} /> : <Plus size={18} />)}
      </Button>
    </div>
  );
}
