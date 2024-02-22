"use client";

import { useState, useEffect } from "react";
import {
  sectors,
  industries,
  countries,
  peRatios,
  pegRatios,
  marketCaps,
  earningsDates,
  exchanges,
} from "@/config/screener/filters";
import { Button, Tabs, Tab } from "@nextui-org/react";
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ScreenerProps } from "@/lib/validators/stock";

const ScreenerResults = dynamic(
  () => import("@/app/(stock)/screener/screener-results"),
  {
    ssr: false,
    loading: () => (
      <div className="f-col gap-2 pt-2">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse-right h-[60px]" />
        ))}
      </div>
    ),
  }
);

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const DEFAULT_STATE = {
  exchange: "Any",
  ticker: "",
  sector: "Any",
  industry: "Any",
  country: "Any",
  earningsDate: "Any",
  peRatio: ["Any", "Any"] as [string, string],
  pegRatio: ["Any", "Any"] as [string, string],
  mktCap: "Any",
  sma50: ["Any", "Any"] as [string, string],
};

export default function Page({ searchParams }: Props) {
  const [resetCounter, setResetCounter] = useState(0);
  const [input, setInput] = useState<ScreenerProps>(DEFAULT_STATE);
  const router = useRouter();

  // Cursor defines the current page of the pagination
  const cursor =
    typeof searchParams["cursor"] === "string"
      ? Number(searchParams["cursor"])
      : 1;

  // Take defines how much stocks are being shown per pagination,
  // must be between 1 and 50, otherwise set to 10
  const takeParam =
    (typeof searchParams["take"] === "string" &&
      Number(searchParams["take"])) ??
    10;
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 10;

  useEffect(() => {
    refetch();
    router.replace(`/screener?cursor=${cursor}&take=${take}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, cursor, take]);

  const {
    data: results,
    isFetched,
    refetch,
  } = trpc.stock.query.useQuery({
    ...input,
    cursor,
    take,
  });

  function updateFilter(
    filterId: keyof typeof DEFAULT_STATE,
    newValue: string,
    index: number | null = null
  ) {
    setInput((prev) => {
      if (index !== null && Array.isArray(prev[filterId])) {
        const updatedTuple = prev[filterId] as [string, string];
        updatedTuple[index] = newValue;
        return {
          ...prev,
          [filterId]: updatedTuple,
        };
      } else {
        return {
          ...prev,
          [filterId]: newValue,
        };
      }
    });
  }

  // Set all filters on "Any" on reset button click
  function resetFilters() {
    setInput(DEFAULT_STATE);
    setResetCounter((prev) => prev + 1);
    router.replace(`/screener?cursor=1&take=${take}`);
  }

  const descriptive = [
    {
      id: "exchange",
      label: "Exchange",
      value: input.exchange,
      value2: null,
      options: exchanges,
      setOption: (value: string) => updateFilter("exchange", value),
    },
    {
      id: "sector",
      label: "Sector",
      value: input.sector,
      value2: null,
      options: sectors,
      setOption: (value: string) => updateFilter("sector", value),
    },
    {
      id: "industry",
      label: "Industry",
      value: input.industry,
      value2: null,
      options: industries,
      setOption: (value: string) => updateFilter("industry", value),
    },
    {
      id: "country",
      label: "Country",
      value: input.country,
      value2: null,
      options: countries,
      setOption: (value: string) => updateFilter("country", value),
    },
    {
      id: "earningsDate",
      label: "Earnings Date",
      value: input.earningsDate,
      value2: null,
      options: earningsDates,
      setOption: (value: string) => updateFilter("earningsDate", value),
    },
    {
      id: "mktCap",
      label: "Market Cap",
      value: input.mktCap,
      value2: null,
      options: marketCaps,
      setOption: (value: string) => updateFilter("mktCap", value),
    },
  ];

  const fundamental = [
    {
      id: "peRatio",
      label: "P/E Ratio",
      value: input.peRatio[0],
      value2: input.peRatio[1],
      options: peRatios,
      setOption: (value: string, index?: number) =>
        updateFilter("peRatio", value, index),
    },
    {
      id: "pegRatio",
      label: "PEG Ratio",
      value: input.pegRatio[0],
      value2: input.pegRatio[1],
      options: pegRatios,
      setOption: (value: string, index?: number) =>
        updateFilter("pegRatio", value, index),
    },
  ];

  const technical = [
    {
      id: "sma50",
      label: "SMA 50",
      value: input.sma50[0],
      value2: input.sma50[1],
      options: ["-20%"],
      setOption: (value: string, index?: number) =>
        updateFilter("sma50", value, index),
    },
  ];

  const CONFIG = [
    {
      id: "descriptive",
      name: "Descriptive",
      description: "Filters that describe the stock",
      icon: FileText,
      filters: descriptive,
    },
    {
      id: "fundamental",
      name: "Fundamental",
      description: "Filters based on financial statements",
      icon: Layers,
      filters: fundamental,
    },
    {
      id: "technical",
      name: "Technical",
      description: "Filters based on the stock's chart",
      icon: BarChart2,
      filters: technical,
    },
  ];

  return (
    <div className="f-col lg:flex-row w-full gap-5">
      <div className="f-col">
        {/* Stock Filters */}
        <Tabs aria-label="Filters" color="primary" variant="bordered">
          {CONFIG.map((entry) => (
            <Tab
              key={entry.id}
              title={
                <div className="flex items-center gap-2">
                  <entry.icon size={18} />
                  {entry.name}
                </div>
              }>
              <Card>
                <CardHeader>
                  <CardTitle>{entry.name}</CardTitle>
                  <CardDescription>{entry.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.filters.map((filter) => (
                    <div className="f-col" key={filter.id + resetCounter}>
                      <p className="font-medium text-sm m-1 text-zinc-400">
                        {filter.label}
                      </p>
                      <div className="flex gap-4">
                        {filter.value2 && (
                          <div className="w-full">
                            <Select
                              onValueChange={(e) => filter.setOption(e, 1)}
                              value={filter.value2!}>
                              <SelectTrigger>
                                <SelectValue placeholder="Any">
                                  {filter.value2}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {filter.options.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <CardDescription className="ml-1 text-[13px]">
                              Minimum Value
                            </CardDescription>
                          </div>
                        )}
                        <div className="w-full">
                          <Select
                            onValueChange={(e) => {
                              if (filter.value2) {
                                return filter.setOption(e, 0);
                              }
                              filter.setOption(e);
                            }}
                            value={filter.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any">
                                {filter.value}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {filter.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {filter.value2 && (
                            <CardDescription className="ml-1 text-[13px]">
                              Maximum Value
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Tab>
          ))}
        </Tabs>

        <Button
          color="danger"
          className="self-start"
          aria-label="Reset filters"
          onClick={() => resetFilters()}>
          <RotateCcw size={18} />
          Reset Filters
        </Button>
      </div>

      {/* Screener Results */}
      <div className="f-col w-full flex-1">
        <Tabs aria-label="Options" color="primary" variant="bordered">
          {CONFIG.map((entry) => (
            <Tab
              key={entry.id}
              title={
                <div className="flex items-center gap-2">
                  <entry.icon size={18} />
                  {entry.name}
                </div>
              }>
              <ScreenerResults results={results} isFetched={isFetched} />
            </Tab>
          ))}
        </Tabs>

        {/* Screener Control */}
        {isFetched && results?.length ? (
          <div className="flex gap-3.5 justify-center">
            <Button
              aria-label="Previous page"
              onClick={() =>
                router.push(
                  `/screener?cursor=${
                    cursor >= 1 ? 1 : cursor - 1
                  }&take=${take}`
                )
              }
              className={`${cursor <= 1 && "pointer-events-none opacity-80"}`}>
              <ChevronLeft size={18} />
              Previous
            </Button>
            <Button
              onClick={() =>
                router.push(`/screener?cursor=${cursor + 1}&take=${take}`)
              }
              color="primary"
              aria-label="Next page">
              Next
              <ChevronRight size={18} />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
