import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Verifying...' };

export default function VerifyEmailLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <div className="bg-background fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center pb-20">
      {children}
    </div>
  );
}
