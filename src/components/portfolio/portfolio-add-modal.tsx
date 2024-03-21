"use client";

import { Chip, Spinner } from "@nextui-org/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ListPlus, ListX, Plus } from "lucide-react";
import debounce from "lodash.debounce";
import StockImage from "../stock/stock-image";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from "@/components/ui/command";
import { PortfolioWithStocks } from "@/types/db";
import { trpc } from "@/trpc/client";
import { Stock } from "@prisma/client";

interface Props {
  portfolio: Pick<PortfolioWithStocks, "id" | "title" | "stocks">;
}

export default function PortfolioAddModal({ portfolio }: Props) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [resultHistory, setResultHistory] = useState<
    (Pick<Stock, "id" | "symbol"> | undefined)[]
  >([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const stocksInPortfolio = new Set(portfolio.stocks.map((s) => s.stockId));

  const request = debounce(async () => refetch(), 300);
  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isFetching,
    data: results,
    refetch,
  } = trpc.stock.search.useQuery(input, { enabled: false });

  useEffect(() => {
    if (results) {
      const combinedResults = [...resultHistory, ...results];

      // Create new Set to remove duplicates and convert it back to array
      const uniqueResults = Array.from(
        new Set(combinedResults.map((stock) => stock?.id))
      ).map((id) => combinedResults.find((stock) => stock?.id === id));

      setResultHistory(uniqueResults);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const { mutate: addToPortfolio, isLoading } = trpc.portfolio.add.useMutation({
    onError: () => toast.error("Failed to add stocks to portfolio."),
    onSuccess: () => router.refresh(),
  });

  async function onSubmit() {
    if (selected.length < 1) {
      return toast.info("Please select atleast one stock.");
    } else if (selected.length > 20) {
      return toast.warning("You can only add 20 stocks at a time.");
    }

    const positions = await Promise.all(
      selected.map(async (id) => {
        return {
          stockId: id,
          quantity: 1,
          price: 0,
          date: new Date().toISOString(),
        };
      })
    );

    addToPortfolio({
      portfolioId: portfolio.id,
      positions: positions,
    });

    setSelected([]);
    setOpen(false);
  }

  function modifyPortfolio(id: string) {
    if (selected.includes(id)) {
      return setSelected(selected.filter((s) => s !== id));
    }

    setSelected([...selected, id]);
  }

  return (
    <>
      <Button
        variant="primary"
        aria-label="Add new stocks"
        size="icon"
        onClick={() => setOpen((prev) => (prev === open ? !open : open))}>
        <Plus size={18} />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          isLoading={isFetching}
          onValueChange={(text) => {
            setInput(text);
            debounceRequest();
          }}
          value={input}
          placeholder="Search stocks..."
        />

        {input.length > 0 && (
          <CommandList key={results?.length}>
            {isFetching ? (
              <CommandEmpty>
                <Spinner />
              </CommandEmpty>
            ) : !results?.length ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Stocks">
                {results?.map((result) => (
                  <CommandItem
                    key={result.id}
                    disabled={stocksInPortfolio.has(result.id)}
                    onSelect={() => modifyPortfolio(result.id)}
                    value={result.symbol + result.companyName}
                    className={`flex items-center justify-between cursor-pointer ${
                      stocksInPortfolio.has(result.id) && "opacity-50"
                    }`}>
                    <div className="flex items-center gap-2">
                      <StockImage src={result.image} px={30} />
                      <div className="f-col">
                        <p className="text-sm font-medium">{result.symbol}</p>
                        <p className="w-[200px] text-[12px] text-zinc-600">
                          {result.companyName}
                        </p>
                      </div>
                    </div>
                    {selected.includes(result.id) ? (
                      <div className="h-10 w-10 border bg-card f-box bg-red-500 rounded-md">
                        <ListX size={18} />
                      </div>
                    ) : (
                      <div className="h-10 w-10 border bg-card f-box bg-green-500 rounded-md">
                        <ListPlus size={18} />
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
        <div className="flex border-t p-2 px-3 justify-between">
          <div className="flex items-center gap-1">
            {selected.length === 0 && (
              <p className="text-zinc-500 text-sm">
                Stocks you select will appear here
              </p>
            )}
            {selected
              .slice(0, selected.length > 4 ? 4 : selected.length)
              .map((id) => (
                <Chip key={id}>
                  {resultHistory?.map((r) => (r?.id === id ? r.symbol : null))}
                </Chip>
              ))}
            {selected.length > 4 && <Chip>...{selected.length - 4}</Chip>}
          </div>

          <Button
            color="primary"
            size="icon"
            aria-label="Add new stocks"
            isLoading={isLoading}
            onClick={onSubmit}>
            {!isLoading && <Plus size={18} />}
          </Button>
        </div>
      </CommandDialog>
    </>
  );
}
