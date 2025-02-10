'use client';

import { DialogButtons } from '@/components/dialog-buttons';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { useMutation } from '@tanstack/react-query';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { StockQuote } from '../stock/types/stock';
import { removePosition as removePositionFn } from './actions/remove-position';

interface Props {
  portfolioId: string;
  stock: Pick<StockQuote, 'id' | 'symbol' | 'companyName' | 'image' | 'price'>;
  quantity?: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SellPositionForm = ({
  portfolioId,
  stock,
  quantity,
  setOpen,
}: Readonly<Props>) => {
  const { mutate: removePosition, isPending } = useMutation({
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
    <form onSubmit={onSubmit} className="space-y-6">
      <section>
        <div className="flex h-10 items-center gap-3">
          <p className="text-desc w-24 text-[13px]">Symbol</p>
          <SymbolItem stock={stock} fullLength className="mr-1.5" size="sm" />
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
        isPending={isPending}
        setOpen={setOpen}
        buttonText="I am sure, sell position"
        buttonLoadingText="Selling Position"
      />
    </form>
  );
};
