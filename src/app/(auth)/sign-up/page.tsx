import { AuthCard } from '@/components/auth/auth-card';
import { OAuth } from '@/components/auth/oauth';
import { Separator } from '@/components/ui/separator';
import { SignUp } from '@/features/auth/sign-up';
import Link from 'next/link';

export const metadata = { title: 'Sign Up' };

export default function SignUpPage() {
  return (
    <AuthCard
      header="Create an account"
      subHeader="Enter your email below to create your account."
    >
      <div className="f-col gap-4">
        <SignUp />
        <div className="f-center justify-between gap-2">
          <Separator className="flex-1" />
          <p className="text-center text-xs text-gray-400">OR CONTINUE WITH</p>
          <Separator className="flex-1" />
        </div>

        <div className="f-col gap-2">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </div>

      <div className="f-box gap-1.5 text-sm">
        <p className="text-gray-400">Already signed up?</p>
        <Link href="/sign-in" className="font-medium">
          Sign In.
        </Link>
      </div>
    </AuthCard>
  );
}
