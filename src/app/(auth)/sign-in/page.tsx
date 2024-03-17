import OAuth from "../oauth";
import CompanyLogo from "@/components/shared/company-logo";
import SignIn from "./sign-in";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

export const metadata = { title: "Sign In" };
// export const runtime = "edge";

export default function page() {
  return (
    <Card className="p-3 w-[400px]">
      <CardHeader className="gap-3.5">
        <CompanyLogo px={50} />
        <div className="f-col">
          <h3 className="font-semibold text-xl">Sign In</h3>
          <p className="text-zinc-400 text-[15px]">Log in to your account</p>
        </div>
      </CardHeader>

      <CardBody className="f-col gap-4">
        <div className="text-[12px] bg-green-500/60 p-1 px-3 rounded-md">
          Credentials login is now in beta.
        </div>

        <SignIn />
        <Separator />

        <div className="f-col gap-2">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </CardBody>

      <CardFooter className="f-box text-sm">
        New to our platform?
        <Link
          href="/sign-up"
          className="rounded-md p-1 px-1.5 font-medium text-primary">
          Sign Up.
        </Link>
      </CardFooter>
    </Card>
  );
}
