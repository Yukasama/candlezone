import { AuthCard } from '@/features/auth/components/auth-card';
import Link from 'next/link';

export const metadata = { title: 'Oops, something went wrong!' };

export default function AuthErrorPage() {
  return (
    <AuthCard
      header="Oops, something went wrong!"
      subHeader="An error occurred while processing your authentication request."
    >
      <div className="flex items-center justify-center gap-1.5 text-sm">
        <Link className="font-medium" href="/sign-in">
          Go back.
        </Link>
      </div>
    </AuthCard>
  );
}
