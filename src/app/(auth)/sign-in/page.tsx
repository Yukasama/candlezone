import { OAuth } from "../oauth";
import { SignIn } from "./sign-in";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Sign In" };
// export const runtime = "edge";

export default function Page() {
  return (
    <div className="md:p-3 f-col gap-3 w-[400px] sm:w-[500px]">
      <div className="f-col gap-1 items-center">
        <h3 className="font-semibold text-2xl">Sign in to your account</h3>
        <p className="text-zinc-400 text-[15px]">
          Enter your credentials to enter your account
        </p>
      </div>

      <div className="f-col gap-4">
        <SignIn />
        <div className="flex justify-between items-center gap-2">
          <Separator className="flex-1" />
          <p className="text-xs text-center text-zinc-400">OR CONTINUE WITH</p>
          <Separator className="flex-1" />
        </div>

        <div className="f-col gap-2">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </div>

      <div className="f-box gap-1.5 text-sm mt-2.5">
        <p className="text-zinc-400">New to our platform?</p>
        <Link href="/sign-up" className="font-medium">
          Sign Up.
        </Link>
      </div>
    </div>
  );
}
