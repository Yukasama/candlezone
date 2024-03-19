"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
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
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          startContent={<Plus size={18} />}
          aria-label="Add stock to portfolio"
        />
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
            <Button href="/portfolio" color="primary" as={Link}>
              Create Portfolio
            </Button>
          </div>
        ) : (
          <div className="f-col gap-2 items-center p-2">
            Sign in to create portfolios
            <Button href="/sign-in" color="primary" as={Link}>
              Sign In
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
