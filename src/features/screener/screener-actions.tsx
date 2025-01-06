'use client';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { env } from '@/env.mjs';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { Check, Copy, Filter, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

const ScreenerFilters = dynamic(
  () => import('./screener-filters').then((mod) => mod.ScreenerFilters),
  {
    ssr: false,
    loading: () => (
      <div className="f-box">
        <Loader className="mt-[200px]" />
      </div>
    ),
  },
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
        className="motion-preset-slide-down-md"
        onClick={() => {
          copyToClipboard(currentUrl);
        }}
      >
        {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
        <p className="hidden lg:block">Copy to clipboard</p>
      </Button>
      <Drawer>
        <DrawerTrigger asChild className="lg:hidden">
          <Button
            variant="secondary"
            size="sm"
            className="motion-preset-slide-down-md lg:animate-none"
            aria-label="Open filters"
          >
            <Filter className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerTitle>Screener Filters</DrawerTitle>
          <ScreenerFilters className="pt-2" />
        </DrawerContent>
      </Drawer>

      <Button
        size="sm"
        className="motion-preset-slide-down-md h-[35px]"
        variant="destructive"
        onClick={() => {
          router.replace('/screener');
        }}
      >
        <RotateCcw className="size-4" />
        <p className="hidden lg:block">Reset filters</p>
      </Button>
    </div>
  );
};
