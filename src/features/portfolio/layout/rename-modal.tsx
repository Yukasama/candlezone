'use client';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { updatePortfolio } from '@/features/portfolio/actions/update-portfolio';
import { Portfolio } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  portfolio: Pick<Portfolio, 'id' | 'title'>;
}

export const RenameModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState(portfolio.title);
  const router = useRouter();

  const { mutate: renamePortfolio, isPending } = useMutation({
    mutationFn: updatePortfolio,
    onError: () => toast.error('Failed to rename order.'),
    onSuccess: ({ error }) => {
      if (error) {
        return toast.error(error);
      }
      router.refresh();
    },
  });

  const onSubmit = () => {
    if (!input) {
      return setInput(portfolio.title);
    }
    if (input === portfolio.title && isPending) {
      return;
    }
    if (input.length > 26) {
      return toast.warning('Title can be no longer than 25 characters.');
    }

    renamePortfolio({
      portfolioId: portfolio.id,
      title: input,
    });
  };

  return (
    <DialogContent>
      <DialogHeader className="f-col">
        <DialogTitle className="w-54 truncate">Rename Portfolio</DialogTitle>
        <DialogDescription>
          Change the title of your portfolio.
        </DialogDescription>
      </DialogHeader>
      <div>
        <Input
          placeholder="New portfolio title"
          aria-label="Rename portfolio"
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="p-1 text-sm text-gray-400">
          Choose a name between 1 and 25 characters.
        </p>
      </div>
      <DialogFooter>
        <DialogClose>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button isLoading={isPending} type="submit" onClick={onSubmit}>
          Rename
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
