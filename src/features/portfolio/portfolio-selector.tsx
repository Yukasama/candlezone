'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import type { Portfolio } from '@prisma/client';
import { ChevronsUpDown, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CreatePortfolioForm } from './create-portfolio-form';

interface Props {
  portfolio: Portfolio;
  userPortfolios?: Portfolio[];
}

export const PortfolioSelector = ({ portfolio, userPortfolios }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="faded"
            className="flex h-11 min-w-44 justify-between px-1.5 pr-2 sm:min-w-48"
          >
            <PortfolioItem portfolio={portfolio} size="sm" />
            <ChevronsUpDown size={18} className="text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userPortfolios
            ?.filter((p) => p.id !== portfolio.id)
            .map(({ id, ...entry }) => (
              <Link key={id} href={`/p/${id}`}>
                <DropdownMenuItem className="pr-12">
                  <PortfolioItem portfolio={{ ...entry, id }} size="sm" />
                </DropdownMenuItem>
              </Link>
            ))}
          <DropdownMenuItem
            className="flex gap-3"
            onClick={() => {
              setOpen(true);
            }}
          >
            <div className="f-center gap-2.5 px-0.5 pt-1">
              <Button
                size="icon"
                className="rounded-full"
                aria-label="Create portfolio"
              >
                <Plus size={18} />
              </Button>
              <div>
                <CardTitle>Create new</CardTitle>
                <CardDescription>Create a new portfolio</CardDescription>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title="Create Portfolio"
        description="Create a personal portfolio to track your stocks."
      >
        <CreatePortfolioForm
          numberOfPortfolios={userPortfolios?.length}
          setOpen={setOpen}
        />
      </ResponsiveDialog>
    </>
  );
};
