'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { StockQuote } from '@/features/stock/types/stock';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NewOrderForm } from './new-order-form';

interface Props {
  stock: StockQuote;
  portfolios?: PortfolioWithQuotes[];
}

export const NewOrder = ({ stock, portfolios = [] }: Readonly<Props>) => {
  const [open, setOpen] = useState(false);

  const { data: user } = useSession();
  const router = useRouter();

  const onClick = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    setOpen(true);
  };

  const message = user ? 'Add stock to portfolio' : 'Sign in to add stocks';

  return (
    <>
      <CustomTooltip side="bottom" content={message}>
        <Button
          size="icon"
          variant="faded"
          aria-label={message}
          onClick={onClick}
        >
          <Plus size={18} />
        </Button>
      </CustomTooltip>
      <ResponsiveDialog open={open} setOpen={setOpen} title="New Order">
        <NewOrderForm stock={stock} portfolios={portfolios} setOpen={setOpen} />
      </ResponsiveDialog>
    </>
  );
};
