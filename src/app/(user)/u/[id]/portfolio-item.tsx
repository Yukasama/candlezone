import PortfolioImage from "@/components/portfolio/portfolio-image";
import { Card } from "@/components/ui/card";
import { Portfolio } from "@prisma/client";
import Link from "next/link";

interface Props {
  portfolio: Pick<Portfolio, "id" | "title" | "createdAt" | "color">;
}

export const PortfolioItem = ({ portfolio }: Props) => {
  return (
    <Link key={portfolio.id} href={`/p/${portfolio.id}`} prefetch={false}>
      <Card className="p-2 h-12 flex items-center w-full bg-item hover:bg-item-hover">
        <div className="flex items-center gap-2">
          <PortfolioImage portfolio={portfolio} px={35} />
          <div>
            <p className="text-sm">{portfolio.title}</p>
            <p className="text-[12px] text-zinc-500">
              Created on {portfolio.createdAt.toISOString().split("T")[0]}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
