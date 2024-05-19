'use client'

import { Portfolio } from '@prisma/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { HTMLAttributes, useState } from 'react'
import { Earth, Lock } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { updatePortfolio } from '@/actions/portfolio/update-portfolio'
import { Button } from '../ui/button'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  portfolio: Pick<Portfolio, 'id' | 'isPublic'>
}

export const UpdateVisibility = ({ portfolio, className }: Readonly<Props>) => {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(portfolio.isPublic)

  const { mutate: updateVisibility, isPending } = useMutation({
    mutationFn: updatePortfolio,
    onError: () => toast.error('Failed to change portfolio visibility.'),
    onSuccess: () => router.refresh(),
  })

  const onSubmit = () => {
    setIsPublic((prev) => !prev)
    updateVisibility({ portfolioId: portfolio.id, isPublic })
  }

  const statusIcon = isPublic ? <Earth size={18} /> : <Lock size={18} />

  return (
    <Button
      size="icon"
      variant="horizon"
      isLoading={isPending}
      aria-label="Toggle visibility"
      className={cn(className)}
      onClick={onSubmit}
    >
      {!isPending && statusIcon}
    </Button>
  )
}
