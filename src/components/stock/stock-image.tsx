"use client";

import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  src?: string | null;
  px?: number;
  priority?: boolean;
}

export default function StockImage({
  src,
  priority = false,
  px = 40,
  className,
  ...props
}: Props) {
  const [error, setError] = useState(false);

  return (
    <div
      className={cn("f-box rounded-full", className)}
      style={{ width: px, height: px }}
      {...props}>
      {src && !error ? (
        <Image
          className={cn(
            `p-1 ${src.includes("AAPL") && "invert dark:invert-0"}`,
            className
          )}
          src={src}
          height={px}
          width={px}
          priority={priority}
          onError={() => setError(true)}
          alt="Stock Logo"
        />
      ) : (
        <div
          style={{ height: px, width: px }}
          className="f-box p-1 rounded-full bg-zinc-300 dark:bg-zinc-700">
          <ImageOff size={18} />
        </div>
      )}
    </div>
  );
}
