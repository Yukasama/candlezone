import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { UpdateUserForm } from '@/features/user/settings/update-user-form';
import { db } from '@/lib/db';
import { Suspense } from 'react';

export default async function SettingsProfilePage() {
  const user = await getUser();
  const dbUser = await db.user.findUnique({
    select: { biography: true },
    where: { id: user?.id },
  });

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl">Profile Information</h1>
        <p className="text-desc text-sm">
          Control how your profile appears to others
        </p>
        <Separator className="mt-2" />
      </div>
      <Suspense>
        <UpdateUserForm
          user={{
            biography: dbUser?.biography ?? 'Failed to load biography.',
            email: user?.email ?? '',
            name: user?.name ?? '',
          }}
        />
      </Suspense>
    </div>
  );
}
