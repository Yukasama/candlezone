import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Backtracker' };

export default function BacktrackerLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return <>{children}</>;
}
