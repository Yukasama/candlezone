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
import { HTMLAttributes } from 'react';
import { loadPortfolioLinks } from '../config/load-portfolio-links';

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolioId: string;
}

export const ModeSelector = ({ portfolioId, className }: Props) => {
  const pathname = usePathname();

  const currentTag = pathname.split('/').pop();
  const currentMode = currentTag === portfolioId ? 'overview' : currentTag;
  const links = loadPortfolioLinks(portfolioId);

  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="f-center">
          <Button
            size="icon-sm"
            variant={
              currentMode === 'overview'
                ? 'horizon'
                : currentMode === 'performance'
                  ? 'success'
                  : currentMode === 'analyze'
                    ? 'mythic'
                    : 'secondary'
            }
          >
            {links.find(({ href }) => href === pathname)?.title}
            <ChevronsUpDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.map(({ title, href, icon }) => (
            <DropdownMenuItem key={title}>
              <Link href={href} className="f-center gap-2">
                {icon}
                {title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
