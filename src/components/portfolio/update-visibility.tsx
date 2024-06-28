'use client'

import { updatePortfolio } from '@/actions/portfolio/update-portfolio'
import { cn } from '@/lib/utils'
import { Portfolio } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Lock, LockOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type HTMLAttributes } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  portfolio: Pick<Portfolio, 'id' | 'isPublic'>
}

export const UpdateVisibility = ({ portfolio, className }: Readonly<Props>) => {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(portfolio.isPublic)

  const { mutate: updateVisibility, isPending } = useMutation({
    mutationFn: updatePortfolio,
    onError: () => {
      toast.error('Failed to change portfolio visibility.')
      setIsPublic(portfolio.isPublic)
    },
    onSuccess: () => router.refresh(),
  })

  const onSubmit = () => {
    setIsPublic((prev) => {
      const newIsPublic = !prev
      updateVisibility({ portfolioId: portfolio.id, isPublic: newIsPublic })
      return newIsPublic
    })
  }

  const icon = isPublic ? <LockOpen size={18} /> : <Lock size={18} />

  return (
    <Button
      size="icon"
      isLoading={isPending}
      aria-label="Toggle visibility"
      className={cn(className)}
      onClick={onSubmit}
    >
      {!isPending && icon}
    </Button>
  )
}
