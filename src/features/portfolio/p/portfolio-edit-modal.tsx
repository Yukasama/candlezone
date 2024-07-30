import { UpdateVisibility } from '@/components/portfolio/update-visibility'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Portfolio } from '@prisma/client'
import { PortfolioDeleteModal } from '../portfolio-delete-modal'

export const PortfolioEditModal = ({
  portfolio,
}: {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'isPublic' | 'createdAt'>
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button variant="secondary">Edit</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}
