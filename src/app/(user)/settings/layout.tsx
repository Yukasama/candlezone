import type { PropsWithChildren } from "react";
import {
  UserIcon,
  Grid,
  MessageCircle,
  CreditCard,
  LockIcon,
  Settings2,
} from "lucide-react";
import SettingsItem from "@/app/(user)/settings/settings-item";
import { getUser } from "@/lib/auth";
import { Avatar } from "@nextui-org/react";

// export const runtime = "edge";

export default async function Layout({ children }: PropsWithChildren) {
  const user = await getUser();
  const tabs = [
    {
      id: "settings",
      label: "Public Profile",
      icon: <UserIcon className="text-zinc-400 h-4 w-4" />,
    },
    {
      id: "account",
      label: "Account",
      icon: <Settings2 className="text-zinc-400 h-4 w-4" />,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <Grid className="text-zinc-400 h-4 w-4" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <LockIcon className="text-zinc-400 h-4 w-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <MessageCircle className="text-zinc-400 h-4 w-4" />,
    },
    {
      id: "billing",
      label: "Billing Information",
      icon: <CreditCard className="text-zinc-400 h-4 w-4" />,
    },
  ];

  return (
    <div className="f-col px-6 md:pl-20 md:pr-14 lg:pl-32 lg:pr-28 xl:pl-64 xl:pr-56 p-8 sm:p-12 gap-7 sm:gap-10">
      <div className="flex gap-4 items-center">
        <Avatar
          showFallback
          isBordered
          src={user?.image ?? undefined}
          name={user?.name?.[0].toUpperCase()}
          alt="profile picture"
        />
        <div className="f-col">
          <h3 className="text-xl font-medium">{user?.name}</h3>
          <p className="text-zinc-400 text-sm">
            User Settings associated with your account
          </p>
        </div>
      </div>

      <div className="f-col sm:flex-row gap-10 md:gap-16">
        <div className="f-col gap-0.5 min-w-full sm:min-w-[250px] lg:min-w-[300px]">
          {tabs.map((tab) => (
            <SettingsItem key={tab.id} {...tab} />
          ))}
        </div>
        <div className="flex px-4 p-2 flex-1">{children}</div>
      </div>
    </div>
  );
}
