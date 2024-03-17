import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import dynamic from "next/dynamic";

export const metadata = { title: "Profile Settings" };

const ProfileForm = dynamic(
  () => import("@/app/(user)/settings/profile-form"),
  {
    ssr: false,
    loading: () => (
      <div className="f-col gap-3 w-full">
        {[...Array(4)].map((_, i) => (
          <>
            <Skeleton key={i} className="h-5" />
            <Skeleton className="h-12 w-full" />
          </>
        ))}
      </div>
    ),
  }
);

export default async function page() {
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    select: { email: true, name: true, biography: true },
    where: { id: user?.id },
  });

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Profile</h2>
        <Separator />
        <small className="text-sm text-zinc-500">
          These changes will appear on your public profile.
        </small>
      </div>

      <ProfileForm user={dbUser} />
    </div>
  );
}
