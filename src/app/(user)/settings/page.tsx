import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { ProfileForm } from '@/components/user/profile-form'

export const metadata = { title: 'Profile Settings' }

export default async function SettingsPage() {
  const user = await getUser()
  const dbUser = await db.user.findFirst({
    select: { email: true, name: true, biography: true },
    where: { id: user?.id },
  })

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Profile</h2>
        <Separator />
        <p className="text-sm text-slate-500">
          These changes will appear on your public profile.
        </p>
      </div>

      <ProfileForm user={dbUser} />
    </div>
  )
}
