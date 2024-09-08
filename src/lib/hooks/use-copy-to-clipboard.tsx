'use client';

import { useState } from 'react';

export interface Props {
  timeout?: number;
}

export function useCopyToClipboard({ timeout = 2000 }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    void navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      return setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
}
