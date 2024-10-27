'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
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
  const links = loadPortfolioLinks(portfolioId);

  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <CustomTooltip content="Select portfolio mode">
          <DropdownMenuTrigger asChild className="f-center">
            <Button size="icon-sm" variant="faded">
              <div className="hidden sm:flex">
                {links.find(({ href }) => href === pathname)?.title}
              </div>
              <ChevronsUpDown size={16} />
            </Button>
          </DropdownMenuTrigger>
        </CustomTooltip>
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
