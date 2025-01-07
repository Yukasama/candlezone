'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { PropsWithChildren, useState } from 'react';
import { CreatePortfolioForm } from './create-portfolio-form';

interface Props extends PropsWithChildren {
  numberOfPortfolios?: number;
}

export const CreatePortfolioModal = ({
  numberOfPortfolios,
  children,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title="Create Portfolio"
        description="Create a personal portfolio to track your stocks."
      >
        <CreatePortfolioForm
          numberOfPortfolios={numberOfPortfolios}
          setOpen={setOpen}
        />
      </ResponsiveDialog>
    </>
  );
};
