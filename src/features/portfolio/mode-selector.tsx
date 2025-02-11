'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type HTMLAttributes, useState } from 'react';
import { loadPortfolioLinks } from './config/load-portfolio-links';

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolioId: string;
}

export const ModeSelector = ({ className, portfolioId }: Props) => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const isSettings = pathname.includes('settings');
  const links = loadPortfolioLinks(portfolioId);

  return (
    <div className={cn(className)}>
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild className="flex items-center">
          <Button
            aria-label="Select mode"
            className="size-[34px] px-0 sm:h-8 sm:w-fit sm:px-3"
            size="icon-sm"
            variant="faded"
          >
            <div className="hidden sm:flex">
              {isSettings
                ? 'Settings'
                : links.find(({ href }) => href === pathname)?.title}
            </div>
            <ChevronsUpDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {links.map(({ href, icon, title }) => (
            <Link href={href} key={title}>
              <DropdownMenuItem
                className="flex w-full items-center gap-2"
                onClick={() => setOpen(false)}
              >
                {icon}
                {title}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
