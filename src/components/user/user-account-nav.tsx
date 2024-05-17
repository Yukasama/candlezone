import { Separator } from '../ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import dynamic from 'next/dynamic'
import { Skeleton } from '../ui/skeleton'
import { User } from 'next-auth'
import LogoutLink from '../auth/logout-link'
import { UserAvatar } from './user-avatar'

const UserNavLinks = dynamic(() => import('./user-nav-links'), {
  ssr: false,
  loading: () => <Skeleton />,
})

interface Props {
  user: User
  isAdmin?: boolean
}

export function UserAccountNav({ user, isAdmin }: Readonly<Props>) {
  return (
    <Sheet>
      <SheetTrigger>
        <UserAvatar user={user} className="w-8 h-8" />
      </SheetTrigger>

      <SheetContent className="rounded-l-lg">
        <div className="flex items-center gap-2.5 p-2 mb-1">
          <UserAvatar user={user} className="w-10 h-10" />
          <div className="f-col">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] text-zinc-400 truncate text-sm">
              {user.email}
            </p>
          </div>
        </div>

        <UserNavLinks user={user} isAdmin={isAdmin} />
        <Separator className="my-2" />
        <LogoutLink />
      </SheetContent>
    </Sheet>
  )
}
