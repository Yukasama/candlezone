import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Portfolio } from '@prisma/client';
import { MoreHorizontal, Pencil, Settings } from 'lucide-react';
import Link from 'next/link';
import { RenameModal } from './rename-modal';
import { UpdateVisibility } from './update-visibility';

interface Props {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>;
}

export const Actions = ({ portfolio }: Props) => {
  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <div className="f-center gap-2">
                <Pencil size={18} />
                Rename
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UpdateVisibility portfolio={portfolio} />
          </DropdownMenuItem>
          <Link href={`/p/${portfolio.id}/settings`}>
            <DropdownMenuItem className="f-center gap-2">
              <Settings size={18} />
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameModal portfolio={portfolio} />
    </Dialog>
  );
};
