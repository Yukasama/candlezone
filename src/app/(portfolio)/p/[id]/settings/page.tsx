import { PageLayout } from '@/components/page-layout';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { DeletePortfolioModal } from '@/features/portfolio/delete-portfolio-modal';
import { UpdatePortfolioForm } from '@/features/portfolio/update-portfolio-form';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { forbidden, notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortfolioSettings({ params }: Readonly<Props>) {
  const { id } = await params;

  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findUnique({
      select: {
        color: true,
        createdAt: true,
        id: true,
        isPublic: true,
        title: true,
        userId: true,
      },
      where: { id },
    }),
  ]);

  if (!portfolio) {
    return notFound();
  }

  const isOwner = user?.id === portfolio.userId;
  if (!isOwner) {
    return forbidden();
  }

  return (
    <PageLayout className="flex flex-col gap-5">
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'link' }),
          'group -ml-4 self-start',
        )}
        href={`/p/${id}`}
      >
        <ChevronLeft className="size-4 duration-300 group-hover:-translate-x-0.5" />
        Back to portfolio
      </Link>

      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-light">Update Portfolio</h2>
            <Separator />
            <p className="text-desc text-sm">
              These changes will update your portfolio.
            </p>
          </div>
          <UpdatePortfolioForm portfolio={portfolio} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-destructive text-2xl font-light">
              Danger Zone
            </h2>
            <Separator />
          </div>
          <DeletePortfolioModal portfolio={portfolio} />
        </div>
      </div>
    </PageLayout>
  );
}
