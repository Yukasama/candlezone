import { OAuth } from "../oauth";
import Link from "next/link";
import { SignUp } from "./sign-up";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Sign Up" };
// export const runtime = "edge";

export default function Page() {
  return (
    <div className="md:p-3 f-col gap-3 w-[400px] sm:w-[500px]">
      <div className="f-col gap-1 items-center">
        <h3 className="font-semibold text-2xl">Create an account</h3>
        <p className="text-zinc-400 text-[15px]">
          Enter your email below to create your account
        </p>
      </div>

      <div className="f-col gap-4">
        <SignUp />
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
        <p className="text-zinc-400">Already signed up?</p>
        <Link href="/sign-in" className="font-medium">
          Sign In.
        </Link>
      </div>
    </div>
  );
}
