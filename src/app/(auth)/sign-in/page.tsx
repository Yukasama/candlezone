import { AuthCard } from '@/components/auth/auth-card';
import { OAuth } from '@/components/auth/oauth';
import { Separator } from '@/components/ui/separator';
import { SignIn } from '@/features/auth/sign-in';
import Link from 'next/link';

export const metadata = { title: 'Sign In' };

export default function SignInPage() {
  return (
    <AuthCard
      header="Sign in to your account"
      subHeader="Enter your credentials to sign in to your account."
    >
      <div className="f-col gap-4">
        <SignIn />
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
        <p className="text-gray-400">New to our platform?</p>
        <Link href="/sign-up" className="font-medium">
          Sign Up.
        </Link>
      </div>
    </AuthCard>
  );
}
