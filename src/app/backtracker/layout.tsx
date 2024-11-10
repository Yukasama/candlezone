import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Backtracker' };
export const runtime = 'edge';

export default function BacktrackerLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return children;
}
