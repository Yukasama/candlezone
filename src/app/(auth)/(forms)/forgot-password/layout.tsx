import { AuthCard } from '@/features/auth/components/auth-card';
import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Forgot Password' };

export default function ForgotPasswordLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <AuthCard
      header="Forgot your password?"
      subHeader="Enter your email to receive a password reset link."
    >
      {children}
    </AuthCard>
  );
}
