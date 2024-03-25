"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "../ui/button";
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
    <Popover>
      <PopoverTrigger>
        <div
          className={buttonVariants({
            size: "small-icon",
          })}
          aria-label="Add stock to portfolio">
          <Plus size={16} />
        </div>
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
              <Button asChild size="sm" variant="primary">
                <Plus size={16} />
                Create Portfolio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="f-col gap-2 items-center p-2">
            Sign in to create portfolios
            <Link href="/sign-in">
              <Button asChild size="sm" variant="primary">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
