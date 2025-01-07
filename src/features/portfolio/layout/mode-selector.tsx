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
import { useState, type HTMLAttributes } from 'react';
import { loadPortfolioLinks } from '../config/load-portfolio-links';

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolioId: string;
}

export const ModeSelector = ({ portfolioId, className }: Props) => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const isSettings = pathname.includes('settings');
  const links = loadPortfolioLinks(portfolioId);

  return (
    <div className={cn(className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild className="f-center">
          <Button
            className="size-[34px] px-0 sm:h-8 sm:w-fit sm:px-3"
            size="icon-sm"
            variant="faded"
            aria-label="Select mode"
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
          {links.map(({ title, href, icon }) => (
            <Link key={title} href={href}>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(false);
                }}
                className="f-center w-full gap-2"
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
