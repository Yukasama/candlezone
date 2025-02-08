'use client';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  isPending: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  buttonText: string;
  buttonLoadingText: string;
  buttonDisabled?: boolean;
}

export const DialogButtons = ({
  isPending,
  setOpen,
  buttonText,
  buttonLoadingText,
  buttonDisabled,
}: Props) => {
  return (
    <section className="w-full gap-2.5 md:flex md:justify-end">
      <Button
        variant="secondary"
        type="button"
        className="hidden md:block"
        disabled={isPending}
        onClick={() => {
          setOpen(false);
        }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant={
          buttonText === 'I am sure, delete' ||
          buttonText === 'I am sure, sell position'
            ? 'destructive'
            : 'default'
        }
        className="mt-9 w-full md:mt-0 md:w-auto"
        disabled={isPending || buttonDisabled}
      >
        {isPending ? (
          <div className="flex items-center">
            <Loader size={36} className="dark:invert-0" />
            {buttonLoadingText}
          </div>
        ) : (
          <span>{buttonText}</span>
        )}
      </Button>
    </section>
  );
};
