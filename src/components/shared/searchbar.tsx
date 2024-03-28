"use client";

import debounce from "lodash.debounce";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { StockImage } from "../stock/stock-image";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from "../ui/command";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Stock } from "@prisma/client";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "../ui/button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  recentStocks?: Pick<Stock, "symbol" | "companyName" | "image">[] | undefined;
  responsive?: boolean;
  footbar?: boolean;
  hotkey?: boolean;
}

export default function Searchbar({
  recentStocks,
  responsive = true,
  footbar = false,
  hotkey = false,
  className,
}: Props) {
  const [input, setInput] = useState("");
  const [isMac, setIsMac] = useState(false);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const request = debounce(async () => refetch(), 300);
  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && hotkey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [hotkey]);

  useEffect(() => {
    setOpen(false);
    setInput("");
  }, [pathname]);

  useEffect(() => {
    setIsMac(navigator.userAgent.toUpperCase().includes("MAC"));
  }, []);

  const {
    isFetching,
    data: results,
    refetch,
  } = trpc.stock.search.useQuery(input, { enabled: false });

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          `p-2 px-3 items-center justify-between w-60 ${
            responsive ? "hidden md:flex" : "flex"
          }`,
          className
        )}
        onClick={() => setOpen((prev) => (prev === open ? !open : open))}
      >
        <div className="flex items-center gap-2">
          <Search size={18} />
          Search stocks...
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-[3px] rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <span className={`${!isMac && "text-[10px]"} mt-[1px]`}>
            {!isMac ? "Strg" : "⌘"}
          </span>
          K
        </kbd>
      </Button>

      {footbar ? (
        <Button
          onClick={() => setOpen((prev) => (prev === open ? !open : open))}
          size="icon"
          aria-label="Search stocks"
          className={`${
            responsive ? "flex md:hidden" : "hidden"
          } w-10 h-10 f-col rounded-full bg-gradient-to-br mb-0.5`}
        >
          <Search size={18} strokeWidth={3} />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen((prev) => (prev === open ? !open : open))}
          size="icon"
          variant="ghost"
          aria-label="Search stocks"
          className={`${responsive ? "flex md:hidden" : "hidden"}`}
        >
          <Search size={18} />
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          isLoading={isFetching}
          onValueChange={(text) => {
            setInput(text);
            debounceRequest();
          }}
          value={input}
          className="h-9 outline-none"
          placeholder="Search stocks..."
        />

        {input.length > 0 && (
          <CommandList key={results?.length} className="f-col gap-1">
            {(recentStocks?.length ?? 0) > 0 && (
              <CommandGroup heading="Recently Viewed">
                {recentStocks?.map((stock) => (
                  <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                    <CommandItem
                      onSelect={() => {
                        router.push(`/stocks/${stock.symbol}`);
                        router.refresh();
                      }}
                      value={stock.symbol + stock.companyName}
                      className="flex items-center gap-3 h-14 cursor-pointer"
                    >
                      <StockImage src={stock.image} px={25} />
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-[12px] text-zinc-500 truncate w-[150px]">
                          {stock.companyName}
                        </p>
                      </div>
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            )}
            {isFetching ? (
              <CommandEmpty>
                <Spinner />
              </CommandEmpty>
            ) : !results?.length ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <>
                {(results?.length ?? 0) > 0 && (
                  <CommandGroup key={results?.length} heading="Stocks">
                    {results?.map((stock, i) => (
                      <Link key={"search" + i} href={`/stocks/${stock.symbol}`}>
                        <CommandItem
                          onSelect={() => {
                            router.push(`/stocks/${stock.symbol}`);
                            router.refresh();
                          }}
                          value={stock.symbol + stock.companyName}
                          className="flex items-center gap-3 h-14 cursor-pointer"
                        >
                          <StockImage src={stock.image} px={25} />
                          <div>
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-[12px] text-zinc-500 truncate w-[150px]">
                              {stock.companyName}
                            </p>
                          </div>
                        </CommandItem>
                      </Link>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        )}
      </CommandDialog>
    </>
  );
}
