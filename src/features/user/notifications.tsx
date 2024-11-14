import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Bell } from 'lucide-react';

export const Notifications = async () => {
  const user = await getUser();
  const notifications = await db.notification.findMany({
    select: {
      id: true,
      message: true,
      createdAt: true,
    },
    where: { userId: user?.id },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Bell size={20} />
      </DropdownMenuTrigger>
      {notifications.map((notification) => (
        <DropdownMenuItem key={notification.id}>
          {notification.message}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
};
