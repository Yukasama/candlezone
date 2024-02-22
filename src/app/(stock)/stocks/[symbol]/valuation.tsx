import { Stock } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatMarketCap } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, "mktCap" | "peRatioTTM" | "pegRatioTTM" | "priceToBookRatioTTM">;
}

export default function Valuation({ stock, className }: Props) {
  const data = [
    {
      title: "Market Cap",
      value: formatMarketCap(stock.mktCap),
      tooltip:
        "Market cap is how much all of a company's shares are worth in the stock market.",
    },
    {
      title: "P/E Ratio",
      value: stock.peRatioTTM?.toFixed(2),
      tooltip:
        "The P/E ratio compares a company's share price to per-share earnings.",
    },
    {
      title: "P/B Ratio",
      value: stock.priceToBookRatioTTM?.toFixed(2),
      tooltip:
        "The P/B ratio compares a company's market capitalization to its book value.",
    },
    {
      title: "EPS",
      value: stock.pegRatioTTM?.toFixed(2),
      tooltip: "EPS measures a company's profit allocated to each stock share.",
    },
  ];

  return (
    <div className={cn("f-col gap-1", className)}>
      <h2 className="font-light text-xl flex md:hidden">Company Valuation</h2>
      <Separator className="flex md:hidden" />
      <div className="grid grid-cols-2 md:flex md:items-center gap-3 md:gap-5 lg:gap-8 pt-2 sm:pt-0">
        {data.map((metric) => (
          <TooltipProvider key={metric.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div key={metric.title}>
                  <p className="font-semibold">{metric.title}</p>
                  <p className="text-zinc-400 text-sm sm:text-[15px]">
                    {metric.value}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{metric.tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
