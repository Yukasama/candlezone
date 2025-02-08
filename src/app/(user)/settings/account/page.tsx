import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { DeleteUserModal } from '@/features/settings/delete-user-modal';
import { Layers } from 'lucide-react';
import { Suspense } from 'react';

export default async function SettingsAccountPage() {
  const user = await getUser();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl">Account Settings</h1>
        <p className="text-sm text-gray-400">
          Manage and administer data linked to your account
        </p>
        <Separator className="mt-2" />
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-light">Export Data</h2>
          <Separator />
          <small className="text-xs text-gray-400">
            Export all data related to your account we have stored in our
            database (Coming soon)
          </small>
        </div>
        <Button variant="secondary" className="self-start" size="sm">
          <Layers size={18} />
          Export Data
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-light">Delete Account</h2>
          <Separator />
          <small className="text-xs text-gray-400">
            Once you delete your account, there is no way to recover it.
          </small>
        </div>
        <Suspense>
          <DeleteUserModal userName={user?.name ?? ''} />
        </Suspense>
      </div>
    </div>
  );
}
