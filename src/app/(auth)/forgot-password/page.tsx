import { AuthCard } from '@/components/auth/auth-card';
import { ForgotPassword } from '@/features/auth/forgot-password';

export const metadata = { title: 'Forgot Password' };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      header="Forgot your password?"
      subHeader="Enter your email to receive a password reset link."
    >
      <ForgotPassword />
    </AuthCard>
  );
}
