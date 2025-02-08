import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser } from '@/features/auth/actions/get-user';
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
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="bg-background"
          aria-label="Open notifications"
        >
          <Bell size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id}>
            {notification.message}
          </DropdownMenuItem>
        ))}
        {notifications.length === 0 && (
          <DropdownMenuItem className="hover:bg-background pointer-events-none">
            No notifications yet
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
