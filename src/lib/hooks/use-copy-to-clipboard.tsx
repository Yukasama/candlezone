'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export interface Props {
  timeout?: number;
}

export const useCopyToClipboard = ({ timeout = 2000 }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof globalThis === 'undefined') {
      toast.error('Could not copy to clipboard!');
      return;
    }

    if (!value) {
      toast.error('Could not copy to clipboard!');
      return;
    }

    void navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      toast.success('Copied to clipboard!');

      return setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { copyToClipboard, isCopied };
};
