"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { PortfolioWithStocks } from "@/types/db";
import AddStockPortfolioItem from "./add-stock-portfolio-item";
import { Stock } from "@prisma/client";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  stock: Pick<Stock, "id" | "symbol"> | undefined;
  portfolios:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "isPublic"
      >[]
    | undefined;
}

export default function AddStockPortfolio({ stock, portfolios }: Props) {
  const user = useAuth();

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button size="icon" aria-label="Add stock to portfolio">
          <Plus size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {user && portfolios?.length ? (
          <div className="f-col gap-2.5">
            {stock &&
              portfolios?.map((portfolio) => (
                <AddStockPortfolioItem
                  key={portfolio.id}
                  portfolio={portfolio}
                  stock={stock}
                />
              ))}
          </div>
        ) : user && !portfolios?.length ? (
          <div className="f-col gap-2 items-center p-2">
            Create a portfolio first
            <Link href="/portfolio">
              <Button size="sm" variant="primary">
                <Plus size={16} />
                Create Portfolio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="f-col gap-2 items-center p-2">
            Sign in to create portfolios
            <Link href="/sign-in">
              <Button size="sm" variant="primary">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
