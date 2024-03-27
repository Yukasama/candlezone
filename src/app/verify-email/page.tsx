import { VerifyEmail } from "./verify-email";

export const metadata = { title: "Verifying..." };
// export const runtime = "edge";

export default function page() {
  return (
    <div className="f-box fixed left-0 top-0 z-20 h-screen w-screen bg-background">
      <VerifyEmail />
    </div>
  );
}
