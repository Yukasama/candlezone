'use client';

import { Loader } from '@/components/loader';
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

const ScreenerFilters = dynamic(
  () => import('./screener-filters').then((mod) => mod.ScreenerFilters),
  {
    loading: () => (
      <div className="flex items-center justify-center">
        <Loader className="mt-[200px]" />
      </div>
    ),
    ssr: false,
  },
);

export const ScreenerActions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { copyToClipboard, isCopied } = useCopyToClipboard({});

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
        className="motion-preset-slide-down-md"
        onClick={() => copyToClipboard(currentUrl)}
        size="sm"
        variant="secondary"
      >
        {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
        <p className="hidden lg:block">Copy to clipboard</p>
      </Button>
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            aria-label="Open filters"
            className="motion-preset-slide-down-md lg:animate-none"
            size="sm"
            variant="secondary"
          >
            <Filter className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent aria-describedby={undefined} className="p-4" side="left">
          <SheetTitle>Screener Filters</SheetTitle>
          <ScreenerFilters className="pt-2" />
        </SheetContent>
      </Sheet>

      <Button
        className="motion-preset-slide-down-md h-[35px]"
        onClick={() => router.replace('/screener')}
        size="sm"
        variant="destructive"
      >
        <RotateCcw className="size-4" />
        <p className="hidden lg:block">Reset filters</p>
      </Button>
    </div>
  );
};
