import { UpdateVisibility } from '@/components/portfolio/update-visibility'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PortfolioDeleteModal } from '@/features/portfolio/portfolio-delete-modal'
import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function PortfolioPerformance({
  params: { id },
}: Readonly<Props>) {
  const [user, portfolio] = await Promise.all([
    getUser(),
    db.portfolio.findFirst({
      where: { id },
    }),
  ])

  if (!portfolio || user?.id !== portfolio?.userId) {
    return notFound()
  }

  return (
    <div>
      <div className="f-col gap-2">
        <Input placeholder="New Title" />
        <UpdateVisibility portfolio={portfolio} />
        <Button>Save</Button>
        <Separator />
        <PortfolioDeleteModal portfolio={portfolio} />
      </div>
      <p className="ml-[5px] text-sm text-gray-400">
        Created on{' '}
        {portfolio.createdAt.toISOString().split('.')[0].split('T')[0]}
      </p>
    </div>
  )
}
