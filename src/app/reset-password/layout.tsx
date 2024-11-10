import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Reset Password' };
export const runtime = 'edge';

export default function ResetPasswordLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return <div className="fixed-layout f-box pb-20">{children}</div>;
}
