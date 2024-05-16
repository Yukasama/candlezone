'use client'

import { Portfolio } from '@prisma/client'
import { useRouter } from 'next/navigation'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Input } from '@nextui-org/input'
import { useMutation } from '@tanstack/react-query'
import { deletePortfolio as deletePortfolioFn } from '../../actions/portfolio/delete-portfolio'

type Props = {
  portfolio: Pick<Portfolio, 'id' | 'title'>
}

export default function PortfolioDeleteModal({ portfolio }: Readonly<Props>) {
  const [input, setInput] = useState('')
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

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
    onClose()
  }

  return (
    <>
      <Button
        className="bg-red-500 text-white"
        isIconOnly
        size="sm"
        onPress={onOpen}
        startContent={<Trash2 size={18} />}
        aria-label="Delete portfolio"
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="f-col">
            <h3 className="w-54 truncate">
              Delete Portfolio {portfolio.title}?
            </h3>
            <p className="text-sm text-zinc-500">
              This action cannot be undone.
            </p>
          </ModalHeader>

          <ModalBody className="grid w-full items-center gap-1.5">
            <Input
              placeholder="CONFIRM"
              labelPlacement="outside"
              aria-label="Confirm deletion of portfolio"
              description="Enter 'CONFIRM' to delete your portfolio."
              onChange={(e) => setInput(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button aria-label="Cancel">Cancel</Button>
            <Button
              className="bg-red-500 text-white"
              isLoading={isPending}
              onClick={onSubmit}
              aria-label="Delete portfolio"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
