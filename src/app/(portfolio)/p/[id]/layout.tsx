import { PortfolioItem } from '@/components/portfolio/portfolio-item';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateModal } from '@/features/portfolio/create-modal';
import { ModeSelector } from '@/features/portfolio/mode-selector';
import { PortfolioSidebar } from '@/features/portfolio/portfolio-sidebar';
import { RenameModal } from '@/features/portfolio/rename-modal';
import { UpdateVisibility } from '@/features/portfolio/update-visibility';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ChevronsUpDown, MoreHorizontal, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  params: { id: string };
}

export async function generateStaticParams() {
  const data = await db.portfolio.findMany({
    select: { id: true },
  });

  return data.map((portfolio) => ({ id: portfolio.id }));
}

export async function generateMetadata({ params: { id } }: Readonly<Props>) {
  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findFirst({
      select: {
        title: true,
        isPublic: true,
        userId: true,
      },
      where: { id },
    }),
  ]);

  const noAccess = !portfolio?.isPublic && user?.id !== portfolio?.userId;
  if (!portfolio || noAccess) {
    return { title: 'Portfolio not found.' };
  }

  return { title: portfolio.title };
}

export default async function PortfolioLayout({
  children,
  params: { id },
}: Readonly<Props>) {
  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findFirst({
      where: { id },
    }),
  ]);

  const userPortfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
    },
    where: { userId: user?.id },
  });

  if (userPortfolios.length === 0) {
    redirect('/p/new');
  }

  const noAccess = !portfolio?.isPublic && user?.id !== portfolio?.userId;
  if (!portfolio || noAccess) {
    return notFound();
  }

  const isOwner = user?.id === portfolio.userId;

  return (
    <div className="flex h-screen">
      <PortfolioSidebar portfolioId={portfolio.id} />
      <div className="w-full overflow-hidden">
        <div className="f-center sticky justify-between border-b p-1.5 px-2.5">
          <Dialog>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="faded"
                  className="flex h-11 min-w-40 justify-between px-2.5 sm:min-w-48"
                >
                  <PortfolioItem portfolio={portfolio} size="sm" />
                  <ChevronsUpDown size={18} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-faded">
                {userPortfolios
                  .filter((p) => p.id !== id)
                  .map((entry) => (
                    <Link key={entry.id} href={`/p/${entry.id}`}>
                      <DropdownMenuItem className="pr-12">
                        <PortfolioItem portfolio={entry} size="sm" />
                      </DropdownMenuItem>
                    </Link>
                  ))}
                <DropdownMenuItem className="flex gap-3">
                  <DialogTrigger asChild>
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
                        <CardDescription>
                          Create a new portfolio
                        </CardDescription>
                      </div>
                    </div>
                  </DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CreateModal />
          </Dialog>
          <div className="f-center gap-2">
            {isOwner && (
              <Dialog>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-faded">
                    <DropdownMenuItem className="hover:bg-faded/80 cursor-pointer gap-2">
                      <DialogTrigger asChild>
                        <div className="f-center gap-2">
                          <Pencil size={16} />
                          Rename
                        </div>
                      </DialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-faded/80 cursor-pointer gap-2">
                      <UpdateVisibility portfolio={portfolio} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <RenameModal portfolio={portfolio} />
              </Dialog>
            )}
            <ModeSelector
              portfolioId={portfolio.id}
              className="flex sm:hidden"
            />
            {isOwner && <Button size="icon-sm">Manage</Button>}
          </div>
        </div>
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
}
