'use client'

import { updatePortfolio as updatePortfolioFn } from '@/actions/portfolio/update-portfolio'
import { Loader } from '@/components/loader'
import { cn } from '@/lib/utils'
import { Portfolio } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Lock, LockOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type HTMLAttributes } from 'react'
import { toast } from 'sonner'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  portfolio: Pick<Portfolio, 'id' | 'isPublic'>
}

export const UpdateVisibility = ({ portfolio, className }: Readonly<Props>) => {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(portfolio.isPublic)

  const { mutate: updatePortfolio, isPending } = useMutation({
    mutationFn: updatePortfolioFn,
    onError: () => {
      toast.error(
        `Failed to set visibility to ${isPublic ? 'private' : 'public'} .`,
      )
      setIsPublic(portfolio.isPublic)
    },
    onSuccess: () => router.refresh(),
  })

  const onSubmit = () => {
    setIsPublic((prev) => {
      const newIsPublic = !prev
      updatePortfolio({ portfolioId: portfolio.id, isPublic: newIsPublic })
      return newIsPublic
    })
  }

  const icon = isPublic ? <LockOpen size={18} /> : <Lock size={18} />

  return (
    <button
      aria-label="Toggle visibility"
      className={cn('flex gap-1.5', className)}
      onClick={onSubmit}
    >
      {isPending ? <Loader size={18} /> : icon}
      Make {isPublic ? 'private' : 'public'}
    </button>
  )
}
