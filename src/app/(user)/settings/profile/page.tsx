import { getUser } from '@/features/auth/actions/get-user';
import { UpdateUserForm } from '@/features/settings/update-user-form';
import { db } from '@/lib/db';
import { Suspense } from 'react';

export default async function SettingsProfilePage() {
  const user = await getUser();
  const dbUser = await db.user.findUnique({
    select: { biography: true },
    where: { id: user?.id },
  });

  return (
    <Suspense>
      <UpdateUserForm
        user={{
          name: user?.name ?? '',
          email: user?.email ?? '',
          biography: dbUser?.biography ?? 'Failed to load biography.',
        }}
      />
    </Suspense>
  );
}
