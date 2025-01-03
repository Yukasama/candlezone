import { PageLayout } from '@/components/page-layout';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/actions/get-user';
import { DeleteModal } from '@/features/portfolio/delete-modal';
import { UpdateForm } from '@/features/portfolio/update-form';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortfolioSettings({ params }: Readonly<Props>) {
  const { id } = await params;

  const user = await getUser();
  const portfolio = await db.portfolio.findUnique({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
      userId: true,
    },
    where: { id, userId: user?.id },
  });

  if (!portfolio) {
    return notFound();
  }

  return (
    <PageLayout className="f-col gap-5">
      <Link
        className={cn(
          buttonVariants({ variant: 'link', size: 'sm' }),
          'group -ml-4 self-start',
        )}
        href={`/p/${id}`}
      >
        <ChevronLeft className="size-4 duration-300 group-hover:-translate-x-0.5" />
        Back to portfolio
      </Link>

      <div className="f-col gap-12">
        <div className="f-col gap-3">
          <div className="f-col gap-1">
            <h2 className="text-2xl font-light">Update Portfolio</h2>
            <Separator />
            <p className="text-sm text-gray-400">
              These changes will update your portfolio.
            </p>
          </div>
          <UpdateForm portfolio={portfolio} />
        </div>

        <div className="f-col gap-3">
          <div className="f-col gap-1">
            <h2 className="text-2xl font-light text-red-500">Danger Zone</h2>
            <Separator />
          </div>
          <DeleteModal portfolio={portfolio} />
        </div>
      </div>
    </PageLayout>
  );
}
