import type { PropsWithChildren } from "react";
import { BackButton } from "./back-button";
import { CompanyLogo } from "@/components/shared/company-logo";

// export const runtime = "edge";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div className="fixed f-col xl:grid xl:grid-cols-2 left-0 top-0 z-20 h-screen w-screen bg-background">
      <BackButton />
      <div className="xl:f-col xl:f-box gap-4 hidden">
        <CompanyLogo px={200} />
        <h2 className="text-3xl font-semibold">Zenathra</h2>
      </div>
      <div className="f-box mt-32 xl:mt-0">{children}</div>
    </div>
  );
}
