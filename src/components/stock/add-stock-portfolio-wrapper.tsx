import { Stock } from "@prisma/client";
import { User } from "next-auth";
import AddStockPortfolio from "./add-stock-portfolio";
import { getPortfoliosByUserId } from "@/lib/data/portfolio";

interface Props {
  stock: Pick<Stock, "id" | "symbol"> | undefined;
  user: User | undefined;
}

export default async function AddStockPortfolioWrapper({ stock, user }: Props) {
  const portfolios = await getPortfoliosByUserId(user?.id);

  return (
    <AddStockPortfolio stock={stock} isAuth={!!user} portfolios={portfolios} />
  );
}
