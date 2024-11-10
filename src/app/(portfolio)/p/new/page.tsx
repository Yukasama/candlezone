import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateModal } from '@/features/portfolio/create-modal';
import { getPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { getUser } from '@/lib/auth';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata = { title: 'New Portfolio' };
export const runtime = 'edge';

export default async function PNewPage() {
  const user = await getUser();
  const portfolios = await getPortfoliosByUser({ userId: user?.id });

  if (portfolios.length > 0) {
    redirect(`/p/${portfolios.at(0)?.id}`);
  }

  return (
    <div className="f-box f-col mt-40 gap-5 lg:gap-8">
      <div>
        <h1 className="text-[22px] font-bold lg:text-3xl">
          You haven&apos;t created a portfolio yet.
        </h1>
        <p className="text-md font-medium text-gray-400 lg:text-lg">
          Create your first portfolio.
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-faded f-center w-[400px] cursor-pointer gap-2.5 rounded-full border p-3 px-4 hover:bg-accent">
            <Button
              size="icon"
              className="pointer-events-none rounded-full"
              aria-label="Create Portfolio"
            >
              <Plus size={18} />
            </Button>
            <div className="space-y-0.5">
              <CardTitle>Create new</CardTitle>
              <CardDescription>Create a new portfolio</CardDescription>
            </div>
          </div>
        </DialogTrigger>
        <Suspense>
          <CreateModal />
        </Suspense>
      </Dialog>
    </div>
  );
}
