import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { ProfileForm } from '@/features/user/settings/profile-form'

export const metadata = { title: 'Profile Settings' }

export default async function SettingsPage() {
  const user = await getUser()
  const dbUser = await db.user.findFirst({
    select: { email: true, name: true, biography: true },
    where: { id: user?.id },
  })

  return (
    <div className="f-col w-full gap-4">
      <div className="f-col gap-1">
        <h2 className="text-2xl font-light">Profile</h2>
        <Separator />
        <p className="text-sm text-gray-400">
          These changes will appear on your public profile.
        </p>
      </div>

      <ProfileForm user={dbUser} />
    </div>
  )
}
