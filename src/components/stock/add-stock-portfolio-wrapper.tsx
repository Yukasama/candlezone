import { db } from "@/db";
import { Stock } from "@prisma/client";
import { User } from "next-auth";
import AddStockPortfolio from "./add-stock-portfolio";

interface Props {
  stock: Pick<Stock, "id" | "symbol"> | undefined;
  user: User | undefined;
}

export default async function AddStockPortfolioWrapper({ stock, user }: Props) {
  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      color: true,
      isPublic: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { userId: user?.id },
  });

  return (
    <AddStockPortfolio stock={stock} isAuth={!!user} portfolios={portfolios} />
  );
}
