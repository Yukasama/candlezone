'use client';

import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { Portfolio } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePortfolio as deletePortfolioFn } from './actions/delete-portfolio';
import { PortfolioItem } from './components/portfolio-item';

interface Props {
  portfolio: Pick<
    Portfolio,
    'color' | 'createdAt' | 'id' | 'isPublic' | 'title'
  >;
}

export const DeletePortfolioModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { isPending, mutate: deletePortfolio } = useMutation({
    mutationFn: deletePortfolioFn,
    onError: () => toast.error('Portfolio could not be deleted.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Portfolio successfully deleted.');
      router.replace('/p/new');
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input !== 'CONFIRM') {
      toast.warning("Please enter 'CONFIRM' to delete your portfolio.");
      return;
    }
    deletePortfolio({ portfolioId: portfolio.id });
  };

  return (
    <>
      <Button
        className="self-start"
        onClick={() => setOpen(true)}
        size="sm"
        variant="destructive"
      >
        <Trash2 size={16} />
        Delete Portfolio
      </Button>
      <ResponsiveDialog
        description="This action cannot be undone."
        open={open}
        setOpen={setOpen}
        title={`Delete Portfolio ${portfolio.title}?`}
      >
        <form className="space-y-6" onSubmit={onSubmit}>
          <section>
            <div className="flex h-10 items-center gap-3">
              <p className="text-desc w-24 text-[13px]">Portfolio</p>
              <PortfolioItem
                className="mr-1.5"
                portfolio={portfolio}
                size="sm"
              />
            </div>
            <div className="flex h-10 items-center gap-3">
              <p className="text-desc w-24 text-[13px]">Visibility</p>
              <Badge>{portfolio.isPublic ? 'Public' : 'Private'}</Badge>
            </div>
            <div className="flex h-10 items-center gap-3">
              <p className="text-desc w-24 text-[13px]">Created on</p>
              <p className="text-[13px]">
                {format(portfolio.createdAt, 'PPP')}
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div>
              <Input
                aria-label="Confirm deletion of portfolio"
                className="text-base"
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={portfolio.title}
                value={nameInput}
              />
              <p className="text-desc pointer-events-none p-1 text-sm">
                Enter &apos;{portfolio.title}&apos; to delete your portfolio.
              </p>
            </div>

            <div>
              <Input
                aria-label="Confirm deletion of portfolio"
                className="text-base"
                onChange={(e) => setInput(e.target.value)}
                placeholder="CONFIRM"
                value={input}
              />
              <p className="text-desc pointer-events-none p-1 text-sm">
                Enter &apos;CONFIRM&apos; to delete your portfolio.
              </p>
            </div>
          </section>

          <DialogButtons
            buttonDisabled={
              input !== 'CONFIRM' || nameInput !== portfolio.title
            }
            buttonLoadingText="Deleting"
            buttonText="I am sure, delete"
            isPending={isPending}
            setOpen={setOpen}
          />
        </form>
      </ResponsiveDialog>
    </>
  );
};
