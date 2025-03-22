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
import { type PropsWithChildren, Suspense } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{ id: string }>;
}

export const generateStaticParams = async () => {
  return await db.portfolio.findMany({ select: { id: true } });
};

export const generateMetadata = async ({ params }: Readonly<Props>) => {
  const { id } = await params;
  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findUnique({
      select: { isPublic: true, title: true, userId: true },
      where: { id },
    }),
  ]);

  const noAccess = !portfolio?.isPublic && user?.id !== portfolio?.userId;
  if (!portfolio || noAccess) {
    return { title: 'Portfolio not found.' };
  }

  return { title: portfolio.title };
};

export default async function PortfolioLayout({
  children,
  params,
}: Readonly<Props>) {
  const { id } = await params;

  const [user, portfolio, userPortfolios] = await Promise.all([
    getUser(),
    getFullPortfolio({ portfolioId: id }),
    getPortfoliosByUser(),
  ]);

  const isOwner = user?.id === portfolio?.userId;
  const noAccess = !portfolio?.isPublic && !isOwner;
  if (!portfolio || noAccess) {
    return notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between border-b p-1.5 px-2.5">
        <PortfolioSelector
          portfolio={portfolio}
          userPortfolios={userPortfolios}
        />
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <CustomTooltip content="Edit portfolio" side="bottom">
                <Link
                  aria-label="Portfolio settings"
                  className={buttonVariants({ size: 'icon', variant: 'ghost' })}
                  href={`/p/${id}/settings`}
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
