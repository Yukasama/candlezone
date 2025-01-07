import { CustomTooltip } from '@/components/custom-tooltip';
import { Button, buttonVariants } from '@/components/ui/button';
import { getUser } from '@/features/auth/actions/get-user';
import { AddOrderModal } from '@/features/order/add-order-modal';
import {
  getFullPortfolio,
  getPortfoliosByUser,
} from '@/features/portfolio/lib/queries';
import { ModeSelector } from '@/features/portfolio/mode-selector';
import { PortfolioSelector } from '@/features/portfolio/portfolio-selector';
import { db } from '@/lib/db';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
    getFullPortfolio({ portfolioId: id }),
    getPortfoliosByUser(),
  ]);

  const isOwner = user?.id === portfolio?.userId;
  const noAccess = !portfolio?.isPublic && isOwner;
  if (!portfolio || noAccess) {
    return notFound();
  }

  return (
    <>
      <div className="f-center justify-between border-b p-1.5 px-2.5">
        <PortfolioSelector
          portfolio={portfolio}
          userPortfolios={userPortfolios}
        />
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
              <AddOrderModal portfolio={portfolio} />
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
