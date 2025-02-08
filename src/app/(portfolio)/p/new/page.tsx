import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { CreatePortfolioModal } from '@/features/portfolio/create-portfolio-modal';
import { getPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata = { title: 'New Portfolio' };

export default async function PNewPage() {
  const portfolios = await getPortfoliosByUser();

  if ((portfolios?.length ?? 0) > 0) {
    return redirect(`/p/${String(portfolios?.at(0)?.id)}`);
  }

  return (
    <div className="mt-40">
      {(portfolios?.length ?? 0) > 0 ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 lg:gap-8">
          <div>
            <h1 className="text-[22px] font-bold lg:text-3xl">
              You haven&apos;t created a portfolio yet.
            </h1>
            <p className="text-md font-medium text-gray-400 lg:text-lg">
              Create your first portfolio.
            </p>
          </div>
          <CreatePortfolioModal>
            <div className="hover:bg-accent bg-faded flex w-[400px] cursor-pointer items-center gap-2.5 rounded-full border p-3 px-4">
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
          </CreatePortfolioModal>
        </div>
      )}
    </div>
  );
}
