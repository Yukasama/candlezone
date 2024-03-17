import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import dynamic from "next/dynamic";
import { SkeletonList } from "../ui/skeleton";
import { User } from "next-auth";
import { Avatar } from "@nextui-org/react";
import LogoutLink from "./logout-link";

const UserNavLinks = dynamic(() => import("./user-nav-links"), {
  ssr: false,
  loading: () => <SkeletonList count={5} />,
});

interface Props {
  user: User;
  isAdmin?: boolean;
}

export function UserAccountNav({ user, isAdmin }: Props) {
  return (
    <Sheet>
      <SheetTrigger>
        <Avatar
          showFallback
          isBordered
          src={user?.image ?? undefined}
          name={user?.name?.[0].toUpperCase()}
          size="sm"
          className="w-7 h-7"
          alt="profile picture"
        />
      </SheetTrigger>

      <SheetContent className="rounded-l-xl">
        <div className="flex items-center gap-3 p-2 mb-1">
          <Avatar
            showFallback
            isBordered
            src={user?.image ?? undefined}
            name={user?.name?.[0].toUpperCase()}
            size="sm"
            alt="profile picture"
          />
          <div className="f-col">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] text-zinc-400 truncate text-sm">
              {user.email}
            </p>
          </div>
        </div>

        <UserNavLinks user={user} isAdmin={isAdmin} />
        <Separator className="my-2" />
        <LogoutLink />
      </SheetContent>
    </Sheet>
  );
}
