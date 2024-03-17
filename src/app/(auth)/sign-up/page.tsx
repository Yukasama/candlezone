import OAuth from "../oauth";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import CompanyLogo from "@/components/shared/company-logo";
import Link from "next/link";
import SignUp from "./sign-up";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Sign Up" };
// export const runtime = "edge";

export default function page() {
  return (
    <Card className="md:p-3 w-[400px]">
      <CardHeader className="gap-3.5">
        <CompanyLogo px={50} />
        <div className="f-col">
          <h3 className="font-medium text-xl">Sign Up</h3>
          <p className="text-zinc-400 text-[15px]">Create a new account</p>
        </div>
      </CardHeader>

      <CardBody className="f-col gap-4">
        <div className="text-[12px] bg-green-500/60 p-1 px-3 rounded-md">
          Credentials login is now in beta.
        </div>

        <SignUp />
        <Separator />

        <div className="f-col gap-2">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </CardBody>

      <CardFooter className="f-box text-sm">
        Already signed up?
        <Link
          href="/sign-in"
          className="rounded-md p-1 px-1.5 font-medium text-primary hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Sign In.
        </Link>
      </CardFooter>
    </Card>
  );
}
