'use client'

import { Portfolio } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { deletePortfolio as deletePortfolioFn } from '@/actions/portfolio/delete-portfolio'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

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
          <p className="text-sm text-zinc-400">This action cannot be undone.</p>
        </DialogHeader>
        <div>
          <Input
            placeholder="CONFIRM"
            aria-label="Confirm deletion of portfolio"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <p className="text-sm p-1 text-zinc-400">
            Enter &apos;CONFIRM&apos; to delete your portfolio.
          </p>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button aria-label="Cancel" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={onSubmit}
            aria-label="Delete portfolio"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
