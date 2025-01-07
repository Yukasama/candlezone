import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DeleteUserModal } from '@/features/settings/delete-user-modal';
import { Layers } from 'lucide-react';
import { Suspense } from 'react';

export default function SettingsAccountPage() {
  return (
    <>
      <div className="space-y-3">
        <div className="f-col gap-0.5">
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
        <div className="f-col gap-0.5">
          <h2 className="text-md font-light">Delete Account</h2>
          <Separator />
          <small className="text-xs text-gray-400">
            Once you delete your account, there is no way to recover it.
          </small>
        </div>
        <Suspense>
          <DeleteUserModal />
        </Suspense>
      </div>
    </>
  );
}
