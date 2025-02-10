'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { PropsWithChildren, useState } from 'react';
import { CreatePortfolioForm } from './create-portfolio-form';

interface Props extends PropsWithChildren {
  numberOfPortfolios?: number;
}

export const CreatePortfolioModal = ({
  children,
  numberOfPortfolios,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </button>
      <ResponsiveDialog
        description="Create a personal portfolio to track your stocks."
        open={open}
        setOpen={setOpen}
        title="Create Portfolio"
      >
        <CreatePortfolioForm
          numberOfPortfolios={numberOfPortfolios}
          setOpen={setOpen}
        />
      </ResponsiveDialog>
    </>
  );
};
