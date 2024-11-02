import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Verifying...' };
export const runtime = 'edge';

export default function VerifyEmailLayout({ children }: PropsWithChildren) {
  return <div className="fixed-layout f-box pb-20">{children}</div>;
}
