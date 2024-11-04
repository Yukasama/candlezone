'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Portfolio } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePortfolio as deletePortfolioFn } from './actions/delete-portfolio';

interface Props {
  portfolio: Pick<Portfolio, 'id' | 'title'>;
}

export const DeleteModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutate: deletePortfolio, isPending } = useMutation({
    mutationFn: deletePortfolioFn,
    onError: () => toast.error('Portfolio could not be deleted.'),
    onSuccess: ({ error }) => {
      if (error) {
        return toast.error(error);
      }
      toast.success('Portfolio successfully deleted.');
      router.push('/p/new');
    },
  });

  function onSubmit() {
    if (input !== 'CONFIRM') {
      return toast.warning("Please enter 'CONFIRM' to delete your portfolio.");
    }

    deletePortfolio({ portfolioId: portfolio.id });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="self-start" variant="destructive">
          <Trash2 size={16} />
          Delete Portfolio
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-54 truncate">
            Delete Portfolio {portfolio.title}?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            placeholder="CONFIRM"
            aria-label="Confirm deletion of portfolio"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <p className="p-1 text-sm text-gray-400">
            Enter &apos;CONFIRM&apos; to delete your portfolio.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={onSubmit}
          >
            I am sure, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
