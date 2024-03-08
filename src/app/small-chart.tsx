"use client";

import { trpc } from "@/trpc/client";
import { Quote } from "@/types/stock";
import { useState, useEffect } from "react";
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import { Spinner } from "@nextui-org/react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote;
  className?: string;
}

export default function SmallChart({ quote, className }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data, isFetched } = trpc.stock.history.useQuery(
    {
      symbol: quote.symbol,
      timeframe: "1D",
    },
    { cacheTime: 1000 * 60 * 5 }
  );

  return (
    <div className={cn("w-[200px] h-[50px] f-box", className)}>
      {mounted && isFetched && data ? (
        <ResponsiveContainer width="100%">
          <LineChart data={data}>
            <YAxis domain={["dataMin", "dataMax"]} hide={true} />
            <Line
              type="monotone"
              dataKey="close"
              stroke={quote.changesPercentage >= 0 ? "#19E363" : "#e6221e"}
              strokeWidth={2.1}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Spinner size="sm" />
      )}
    </div>
  );
}
