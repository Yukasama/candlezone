import PortfolioImage from "./portfolio-image";
import { Portfolio } from "@prisma/client";

interface Props {
  portfolio: Pick<Portfolio, "id" | "title" | "color" | "isPublic">;
}

export default function PortfolioItem({ portfolio }: Props) {
  return (
    <div className="flex items-center gap-[9px]">
      <PortfolioImage portfolio={portfolio} />
      <div>
        <p className="text-[15px] font-medium max-w-[65px] sm:max-w-[150px] truncate">
          {portfolio.title}
        </p>
        <p className="text-sm text-zinc-500">
          {portfolio.isPublic ? "Public" : "Private"}
        </p>
      </div>
    </div>
  );
}
