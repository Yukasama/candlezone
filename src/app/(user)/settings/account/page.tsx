import { Separator } from '@/components/ui/separator'
import { Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteUserModal } from '@/features/user/settings/delete-user-modal'

export const metadata = { title: 'Account Settings' }

export default function AccountSettingsPage() {
  return (
    <div className="f-col w-full gap-4">
      <div className="f-col gap-1">
        <h2 className="text-2xl font-light">Export Data</h2>
        <Separator />
        <small className="text-sm text-gray-400">
          Export all data related to your account we have stored in our database
          (Coming soon)
        </small>
      </div>

      <Button
        variant="secondary"
        className="self-start"
        aria-label="Export data"
      >
        <Layers size={18} />
        Export Data
      </Button>

      <div className="f-col mt-8 gap-1">
        <h2 className="text-2xl font-light">Delete Account</h2>
        <Separator />
        <small className="text-sm text-gray-400">
          Once you delete your account, there is no way to recover it. Please be
          sure you want to delete your account before proceeding.
        </small>
      </div>

      <DeleteUserModal />
    </div>
  )
}
