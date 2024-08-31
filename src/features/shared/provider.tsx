'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

export const Provider = ({ children }: Readonly<PropsWithChildren>) => {
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
        <ThemeProvider defaultTheme="dark" attribute="class">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
