import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { CreateModal } from '@/features/portfolio/create-modal';
import { Actions } from '@/features/portfolio/layout/actions';
import { ModeSelector } from '@/features/portfolio/layout/mode-selector';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ChevronsUpDown, Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const data = await db.portfolio.findMany({
    select: { id: true },
  });

  return data.map((portfolio) => ({ id: portfolio.id }));
}

export async function generateMetadata({ params }: Readonly<Props>) {
  const { id } = await params;

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

export default async function PortfolioLayout(props: Readonly<Props>) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;

  const user = await getUser();
  const [portfolio, userPortfolios] = await Promise.all([
    db.portfolio.findFirst({
      where: { id },
    }),
    db.portfolio.findMany({
      select: {
        id: true,
        title: true,
        isPublic: true,
        color: true,
      },
      where: { userId: user?.id },
    }),
  ]);

  if (userPortfolios.length === 0) {
    redirect('/p/new');
  }

  const noAccess = !portfolio?.isPublic && user?.id !== portfolio?.userId;
  if (!portfolio || noAccess) {
    return notFound();
  }

  const isOwner = user?.id === portfolio.userId;

  return (
    <div className="flex">
      <div className="w-full">
        <div className="f-center sticky top-0 justify-between border-b p-1.5 px-2.5">
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
              <DropdownMenuContent>
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
            {isOwner && <Actions portfolio={portfolio} />}
            <ModeSelector portfolioId={portfolio.id} />
            {isOwner && <Button size="icon-sm">Manage</Button>}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
