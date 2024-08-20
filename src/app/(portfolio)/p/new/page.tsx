import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CreateModal } from '@/features/portfolio/create-modal'
import { getUser } from '@/lib/auth'
import { getPortfoliosByUser } from '@/utils/queries/portfolio'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function PNewPage() {
  const user = await getUser()
  const portfolios = await getPortfoliosByUser({ userId: user?.id })

  if (portfolios.length) {
    redirect(`/p/${portfolios[0].id}`)
  }

  return (
    <div className="f-box f-col mt-40 gap-6">
      <div>
        <h1 className="text-3xl font-bold">
          You havent created a portfolio yet.
        </h1>
        <p className="text-lg font-medium text-gray-400">
          Create your first portfolio.
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="hover:bg-faded/50 bg-faded f-center w-[400px] cursor-pointer gap-2.5 rounded-full border p-3 px-4">
            <Button size="icon" className="pointer-events-none rounded-full">
              <Plus size={18} />
            </Button>
            <div>
              <CardTitle>Create new</CardTitle>
              <CardDescription>Create a new portfolio</CardDescription>
            </div>
          </div>
        </DialogTrigger>
        <CreateModal />
      </Dialog>
    </div>
  )
}
