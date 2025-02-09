'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  nonce?: string;
}

export const Provider = ({ nonce, children }: Readonly<Props>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 10,
      },
    },
  });

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          nonce={nonce}
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
