import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { DeleteUserModal } from '@/features/user/settings/delete-user-modal';
import { Layers, Trash2 } from 'lucide-react';
import { Suspense } from 'react';

export default async function SettingsAccountPage() {
  const user = await getUser();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl">Account Preferences</h1>
        <p className="text-desc text-sm">
          Manage and administer data linked to your account
        </p>
        <Separator className="mt-2" />
      </div>
      <div className="bg-faded space-y-3 rounded-lg p-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-light">Export Data</h2>
          <Separator />
          <small className="text-desc text-xs">
            Export all data related to your account we have stored in our
            database (Coming soon)
          </small>
        </div>
        <Button className="self-start" size="sm" variant="secondary">
          <Layers size={18} />
          Export Data
        </Button>
      </div>
      <div className="bg-faded space-y-3 rounded-lg p-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-light">Delete Account</h2>
          <Separator />
          <small className="text-desc text-xs">
            Once you delete your account, there is no way to recover it.
          </small>
        </div>
        <Suspense
          fallback={
            <Button className="self-start" size="sm" variant="destructive">
              <Trash2 size={18} />
              Delete Account
            </Button>
          }
        >
          <DeleteUserModal userName={user?.name ?? ''} />
        </Suspense>
      </div>
    </div>
  );
}
