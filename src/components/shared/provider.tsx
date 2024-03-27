"use client";

import { trpc } from "@/trpc/client";
import { absoluteUrl } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { type PropsWithChildren, useState } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider } from "next-themes";

export default function Provider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: absoluteUrl("/api/trpc"),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
