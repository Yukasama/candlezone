'use client'

import { deletePortfolio as deletePortfolioFn } from '@/actions/portfolio/delete-portfolio'
import { Portfolio } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'

type Props = {
  portfolio: Pick<Portfolio, 'id' | 'title'>
}

export const PortfolioDeleteModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const { mutate: deletePortfolio, isPending } = useMutation({
    mutationFn: deletePortfolioFn,
    onError: () => {
      toast.error(`Portfolio '${portfolio.title}' could not be deleted.`)
    },
    onSuccess: () => router.push('/portfolio'),
  })

  function onSubmit() {
    if (input !== 'CONFIRM') {
      return toast.warning("Please enter 'CONFIRM' to delete your portfolio.")
    }

    deletePortfolio({ portfolioId: portfolio.id })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" aria-label="Delete portfolio">
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-faded">
        <DialogHeader className="f-col">
          <DialogTitle className="w-54 truncate">
            Delete Portfolio {portfolio.title}?
          </DialogTitle>
          <p className="text-sm text-gray-400">This action cannot be undone.</p>
        </DialogHeader>
        <div>
          <Input
            placeholder="CONFIRM"
            aria-label="Confirm deletion of portfolio"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <p className="p-1 text-sm text-gray-400">
            Enter &apos;CONFIRM&apos; to delete your portfolio.
          </p>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={onSubmit}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
