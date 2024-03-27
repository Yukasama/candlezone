import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Notification Settings" };

export default function Page() {
  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Notifications</h2>
        <Separator />
      </div>
    </div>
  );
}
