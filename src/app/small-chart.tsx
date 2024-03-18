"use client";

import { trpc } from "@/trpc/client";
import { History, Quote } from "@/types/stock";
import { useState, useEffect } from "react";
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import { Spinner } from "@nextui-org/react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  history: History[];
  quote: Quote;
  className?: string;
}

export default function SmallChart({ history, quote, className }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  quote.symbol === "MSFT" && console.log(history, "MASFT");

  return (
    <div className={cn("w-[200px] h-[50px] f-box", className)}>
      {mounted && history ? (
        <ResponsiveContainer width="100%">
          <LineChart data={history}>
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
