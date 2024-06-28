import { cn } from '@/lib/utils'
import { User } from 'next-auth'
import type { HTMLAttributes } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface Props extends HTMLAttributes<HTMLDivElement> {
  user?: User
}

export const UserAvatar = ({ user, className }: Readonly<Props>) => {
  return (
    <Avatar className={cn(className)} aria-label="User Avatar">
      <AvatarImage src={user?.image ?? undefined} alt="profile picture" />
      <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
