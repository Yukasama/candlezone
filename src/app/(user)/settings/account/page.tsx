import { Separator } from '@/components/ui/separator'
import { Layers } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Account Settings' }

const DeleteUserModal = dynamic(
  () => import('@/components/user/delete-user-modal'),
  {
    ssr: false,
    loading: () => <Button isLoading variant="destructive" />,
  }
)

export default function Page() {
  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Export Data</h2>
        <Separator />
        <small className="text-zinc-500 text-sm">
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

      <div className="f-col gap-1 mt-8">
        <h2 className="font-light text-2xl">Delete Account</h2>
        <Separator />
        <small className="text-zinc-500 text-sm">
          Once you delete your account, there is no way to recover it. Please be
          sure you want to delete your account before proceeding.
        </small>
      </div>

      <DeleteUserModal />
    </div>
  )
}
