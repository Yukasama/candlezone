'use client';

import { Button } from '@/components/ui/button';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  buttonDisabled?: boolean;
  buttonLoadingText: string;
  buttonText: string;
  isPending: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DialogButtons = ({
  buttonDisabled,
  buttonLoadingText,
  buttonText,
  isPending,
  setOpen,
}: Props) => {
  return (
    <section className="w-full gap-2.5 md:flex md:justify-end">
      <Button
        className="hidden md:block"
        disabled={isPending}
        onClick={() => {
          setOpen(false);
        }}
        type="button"
        variant="secondary"
      >
        Cancel
      </Button>
      <Button
        className="mt-9 w-full md:mt-0 md:w-auto"
        disabled={buttonDisabled}
        isLoading={isPending}
        type="submit"
        variant={
          buttonText === 'I am sure, delete' ||
          buttonText === 'I am sure, sell position'
            ? 'destructive'
            : 'default'
        }
      >
        {isPending ? buttonLoadingText : buttonText}
      </Button>
    </section>
  );
};
