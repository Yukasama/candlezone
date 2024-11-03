'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { env } from '@/env.mjs';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { Check, Copy, Filter, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export const experimental_ppr = true;

const ScreenerFilters = dynamic(
  () => import('./screener-filters').then((mod) => mod.ScreenerFilters),
  { ssr: false },
);

export const ScreenerActions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCopied, copyToClipboard } = useCopyToClipboard({});

  const currentUrl =
    env.NEXT_PUBLIC_HOST_URL +
    `/screener?${new URLSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      cursor: (searchParams.get('cursor') ?? 1).toString(),
      take: (searchParams.get('take') ?? 10).toString(),
    }).toString()}`;

  return (
    <div className="flex gap-1.5">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => copyToClipboard(currentUrl)}
      >
        {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
        <p className="hidden lg:block">Copy to clipboard</p>
      </Button>
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="secondary" size="sm">
            <Filter className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="hidden">Screener Filters</SheetTitle>
          <Suspense>
            <ScreenerFilters className="pt-2" />
          </Suspense>
        </SheetContent>
      </Sheet>
      <Button
        size="sm"
        className="h-[35px]"
        variant="destructive"
        onClick={() => router.replace('/screener')}
      >
        <RotateCcw className="size-4" />
        <p className="hidden lg:block">Reset filters</p>
      </Button>
    </div>
  );
};
