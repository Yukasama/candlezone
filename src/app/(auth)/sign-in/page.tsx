import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { OAuth } from '@/components/auth/oauth'
import { SignIn } from '@/components/auth/sign-in'
import { AuthCard } from '@/components/auth/auth-card'

export const metadata = { title: 'Sign In' }

export default function SignInPage() {
  return (
    <AuthCard
      header="Sign in to your account"
      subHeader="Enter your credentials to sign in to your account."
    >
      <div className="f-col gap-4">
        <SignIn />
        <div className="flex justify-between items-center gap-2">
          <Separator className="flex-1" />
          <p className="text-xs text-center text-slate-400">OR CONTINUE WITH</p>
          <Separator className="flex-1" />
        </div>

        <div className="f-col gap-2">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </div>

      <div className="f-box gap-1.5 text-sm">
        <p className="text-slate-400">New to our platform?</p>
        <Link href="/sign-up" className="font-medium">
          Sign Up.
        </Link>
      </div>
    </AuthCard>
  )
}
