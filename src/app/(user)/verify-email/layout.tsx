import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Verifying...' };

export default function VerifyEmailLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return <div className="fixed-layout f-box pb-20">{children}</div>;
}
