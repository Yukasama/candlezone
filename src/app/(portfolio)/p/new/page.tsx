import { CreateModal } from '@/features/portfolio/create-modal'
import { getUser } from '@/lib/auth'
import { getPortfoliosByUser } from '@/utils/queries/portfolio'
import { redirect } from 'next/navigation'

export default async function PNewPage() {
  const user = await getUser()
  const portfolios = await getPortfoliosByUser({ userId: user?.id })

  if (portfolios.length) {
    redirect(`/p/${portfolios[0].id}`)
  }

  return (
    <div>
      <h1>Create a new portfolio</h1>
      <p>Here you can create a new portfolio.</p>
      <CreateModal />
    </div>
  )
}
