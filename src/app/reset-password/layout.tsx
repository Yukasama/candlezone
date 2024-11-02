import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Reset Password' };

export default function ResetPasswordLayout({ children }: PropsWithChildren) {
  return <div className="fixed-layout f-box pb-20">{children}</div>;
}
