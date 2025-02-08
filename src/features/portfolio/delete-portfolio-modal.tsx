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
    'id' | 'title' | 'isPublic' | 'color' | 'createdAt'
  >;
}

export const DeletePortfolioModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutate: deletePortfolio, isPending } = useMutation({
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input !== 'CONFIRM') {
      toast.warning("Please enter 'CONFIRM' to delete your portfolio.");
      return;
    }
    deletePortfolio({ portfolioId: portfolio.id });
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
        className="self-start"
        variant="destructive"
      >
        <Trash2 size={16} />
        Delete Portfolio
      </Button>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title={`Delete Portfolio ${portfolio.title}?`}
        description="This action cannot be undone."
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <section>
            <div className="flex h-10 items-center gap-3">
              <p className="w-24 text-[13px] text-gray-400">Portfolio</p>
              <PortfolioItem
                portfolio={portfolio}
                className="mr-1.5"
                size="sm"
              />
            </div>
            <div className="flex h-10 items-center gap-3">
              <p className="w-24 text-[13px] text-gray-400">Visibility</p>
              <Badge>{portfolio.isPublic ? 'Public' : 'Private'}</Badge>
            </div>
            <div className="flex h-10 items-center gap-3">
              <p className="w-24 text-[13px] text-gray-400">Created on</p>
              <p className="text-[13px]">
                {format(portfolio.createdAt, 'PPP')}
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div>
              <Input
                placeholder={portfolio.title}
                aria-label="Confirm deletion of portfolio"
                className="text-base"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                }}
              />
              <p className="pointer-events-none p-1 text-sm text-gray-500">
                Enter &apos;{portfolio.title}&apos; to delete your portfolio.
              </p>
            </div>

            <div>
              <Input
                placeholder="CONFIRM"
                aria-label="Confirm deletion of portfolio"
                className="text-base"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <p className="pointer-events-none p-1 text-sm text-gray-500">
                Enter &apos;CONFIRM&apos; to delete your portfolio.
              </p>
            </div>
          </section>

          <DialogButtons
            isPending={isPending}
            setOpen={setOpen}
            buttonText="I am sure, delete"
            buttonLoadingText="Deleting"
            buttonDisabled={
              input !== 'CONFIRM' || nameInput !== portfolio.title
            }
          />
        </form>
      </ResponsiveDialog>
    </>
  );
};
