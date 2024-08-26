import { PageLayout } from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DeleteModal } from '@/features/portfolio/delete-modal';
import { UpdateForm } from '@/features/portfolio/update-form';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Account Settings' };

interface Props {
  params: { id: string };
}

export default async function PortfolioSettings({
  params: { id },
}: Readonly<Props>) {
  const user = await getUser();
  const portfolio = await db.portfolio.findFirst({
    where: { id, userId: user?.id },
  });

  if (!portfolio) {
    return notFound();
  }

  return (
    <PageLayout>
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
