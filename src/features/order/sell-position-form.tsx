'use client';

import { DialogButtons } from '@/components/dialog-buttons';
import { StockCard } from '@/features/stock/components/stock-card';
import { useMutation } from '@tanstack/react-query';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { StockQuote } from '../stock/types/stock';
import { removePosition as removePositionFn } from './actions/remove-position';

interface Props {
  portfolioId: string;
  quantity?: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  stock: Pick<StockQuote, 'companyName' | 'id' | 'image' | 'price' | 'symbol'>;
}

export const SellPositionForm = ({
  portfolioId,
  quantity,
  setOpen,
  stock,
}: Readonly<Props>) => {
  const { isPending, mutate: removePosition } = useMutation({
    mutationFn: removePositionFn,
    onError: () => toast.error('Failed to remove position.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
      } else {
        setOpen(false);
      }
    },
  });

  const onSubmit = () => {
    removePosition({ portfolioId, stockId: stock.id });
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <section>
        <div className="flex h-10 items-center gap-3">
          <p className="text-desc w-24 text-[13px]">Symbol</p>
          <StockCard stock={stock} />
        </div>
        <div className="flex h-10 items-center gap-3">
          <p className="text-desc w-24 text-[13px]">Quantity</p>
          <p className="text-[13px]">{quantity ?? 'N/A'}</p>
        </div>
        <div className="flex h-10 items-center gap-3">
          <p className="text-desc w-24 text-[13px]">Price</p>
          <p className="text-[13px]">${stock.price}</p>
        </div>
      </section>

      <DialogButtons
        buttonLoadingText="Selling Position"
        buttonText="I am sure, sell position"
        isPending={isPending}
        setOpen={setOpen}
      />
    </form>
  );
};
