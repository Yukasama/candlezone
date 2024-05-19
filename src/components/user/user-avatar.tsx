import type { HTMLAttributes } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from 'next-auth'
import { cn } from '@/lib/utils'

interface Props extends HTMLAttributes<HTMLDivElement> {
  user?: User
}

export const UserAvatar = ({ user, className }: Readonly<Props>) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={user?.image ?? undefined} alt="profile picture" />
      <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
