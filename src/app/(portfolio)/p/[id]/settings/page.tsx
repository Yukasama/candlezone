import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { DeletePortfolioModal } from '@/features/portfolio/delete-portfolio-modal';
import { UpdatePortfolioForm } from '@/features/portfolio/update-portfolio-form';
import { db } from '@/lib/db';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

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
  if (!isOwner && !portfolio.isPublic) {
    return notFound();
  }
  if (!isOwner && portfolio.isPublic) {
    return redirect(`/p/${id}`);
  }

  return (
    <PageLayout className="flex flex-col gap-5">
      <Link href={`/p/${id}`}>
        <Button
          className="-ml-4 self-start"
          showBackArrow
          size="sm"
          variant="link"
        >
          Back to portfolio
        </Button>
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
