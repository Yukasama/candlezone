import { CustomTooltip } from '@/components/custom-tooltip';
import { Button, buttonVariants } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser } from '@/features/auth/actions/get-user';
import { AddModal } from '@/features/order/add-modal';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { CreateModal } from '@/features/portfolio/create-modal';
import { ModeSelector } from '@/features/portfolio/layout/mode-selector';
import { getFullPortfolios } from '@/features/portfolio/lib/queries';
import { db } from '@/lib/db';
import { ChevronsUpDown, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense, type PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Readonly<Props>) {
  const { id } = await params;

  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findUnique({
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
  params,
  children,
}: Readonly<Props>) {
  const { id } = await params;

  const user = await getUser();
  const [portfolio, userPortfolios] = await Promise.all([
    getFullPortfolios({ portfolioId: id }),
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

  const isOwner = user?.id === portfolio?.userId;
  const noAccess = !portfolio?.isPublic && isOwner;
  if (!portfolio || noAccess) {
    return notFound();
  }

  return (
    <>
      <div className="f-center justify-between border-b p-1.5 px-2.5">
        <Dialog>
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
                .filter((p) => p.id !== id)
                .map(({ id, ...entry }) => (
                  <Link key={id} href={`/p/${id}`}>
                    <DropdownMenuItem className="pr-12">
                      <PortfolioItem portfolio={{ ...entry, id }} size="sm" />
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
                      <CardDescription>Create a new portfolio</CardDescription>
                    </div>
                  </div>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Suspense>
            <CreateModal />
          </Suspense>
        </Dialog>
        <div className="f-center gap-2">
          {isOwner && (
            <>
              <CustomTooltip content="Edit portfolio" side="bottom">
                <Link
                  href={`/p/${id}/settings`}
                  className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                  aria-label="Portfolio settings"
                >
                  <Pencil size={18} />
                </Link>
              </CustomTooltip>
              <AddModal portfolio={portfolio} />
            </>
          )}
          <Suspense>
            <ModeSelector portfolioId={portfolio.id} />
          </Suspense>
          {isOwner && <Button size="icon-sm">Manage</Button>}
        </div>
      </div>
      <div>{children}</div>
    </>
  );
}
