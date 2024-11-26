import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Backtracker' };

// eslint-disable-next-line sonarjs/function-return-type
export default function BacktrackerLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return children;
}
