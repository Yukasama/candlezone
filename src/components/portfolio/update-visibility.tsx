'use client'

import { Portfolio } from '@prisma/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { cn } from '@/utils/cn'
import { HTMLAttributes, useState } from 'react'
import { Earth, Lock } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { updatePortfolio } from '@/actions/portfolio/update-portfolio'

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
      size="sm"
      isLoading={isPending}
      isIconOnly
      aria-label="Toggle visibility"
      className={cn(className, 'bg-blue-500 text-white')}
      startContent={!isPending && statusIcon}
      onClick={onSubmit}
    />
  )
}
