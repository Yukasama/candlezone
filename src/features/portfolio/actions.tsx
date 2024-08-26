import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UpdateVisibility } from '@/features/portfolio/update-visibility';
import { Portfolio } from '@prisma/client';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { RenameModal } from './rename-modal';

interface Props {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>;
}

export const Actions = ({ portfolio }: Props) => {
  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-faded">
          <DropdownMenuItem className="hover:bg-faded/80 cursor-pointer gap-2">
            <DialogTrigger asChild>
              <>
                <Pencil size={16} />
                Rename
              </>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-faded/80 cursor-pointer gap-2">
            <UpdateVisibility portfolio={portfolio} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameModal portfolio={portfolio} />
    </Dialog>
  );
};
