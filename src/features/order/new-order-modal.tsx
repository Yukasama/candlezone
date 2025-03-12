'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import type { Stock } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NewOrderForm } from './new-order-form';

interface Props {
  portfolios?: PortfolioWithQuotes[];
  stock: Pick<Stock, 'companyName' | 'id' | 'image' | 'range' | 'symbol'>;
}

export const NewOrderModal = ({ portfolios = [], stock }: Readonly<Props>) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const onClick = () => {
    if (!session) {
      router.push(`/sign-in?callbackUrl=/stocks/${stock.symbol}`);
      return;
    }
    setOpen(true);
  };

  const message = session?.user
    ? 'Add stock to portfolio'
    : 'Sign in to add stocks';

  return (
    <>
      <CustomTooltip content={message} side="bottom">
        <Button
          aria-label={message}
          onClick={onClick}
          size="icon"
          variant="secondary"
        >
          <Plus size={18} />
        </Button>
      </CustomTooltip>
      <ResponsiveDialog open={open} setOpen={setOpen} title="New Order">
        <NewOrderForm portfolios={portfolios} setOpen={setOpen} stock={stock} />
      </ResponsiveDialog>
    </>
  );
};
