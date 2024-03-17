import type { PropsWithChildren } from "react";
import BackButton from "./back-button";

// export const runtime = "edge";

export default async function layout({ children }: PropsWithChildren) {
  return (
    <div className="f-box fixed left-0 top-0 z-20 h-screen w-screen bg-background">
      <BackButton />
      {children}
    </div>
  );
}
