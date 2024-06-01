'use client'

import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Portfolio } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { FormEvent, FocusEvent, HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { updatePortfolio } from '@/actions/portfolio/update-portfolio'
import { Loader } from '../loader'

interface Props extends HTMLAttributes<HTMLInputElement> {
  portfolio: Pick<Portfolio, 'id' | 'title'>
}

export const UpdateTitle = ({ portfolio, className }: Readonly<Props>) => {
  const [title, setTitle] = useState(portfolio.title)
  const router = useRouter()

  const { mutate: updateTitle, isPending } = useMutation({
    mutationFn: updatePortfolio,
    onError: () => toast.error('Failed to change portfolio title.'),
    onSuccess: () => router.refresh(),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title) {
      return setTitle(portfolio.title)
    }

    if (title === portfolio.title && isPending) {
      return
    }

    if (title.length > 26) {
      return toast.warning('Title can be no longer than 25 characters.')
    }

    updateTitle({ portfolioId: portfolio.id, title })
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault()

    if (!title) {
      return setTitle(portfolio.title)
    }

    if (title === portfolio.title && isPending) {
      return
    }

    if (title.length > 26) {
      return
    }

    updateTitle({ portfolioId: portfolio.id, title })
  }

  return (
    <form className="flex items-center max-w-48" onSubmit={handleSubmit}>
      <Input
        className={cn(
          'border-none p-0 h-8 text-xl hover:bg-gray-100 dark:hover:bg-gray-900 pl-1.5 cursor-pointer -translate-x-1.5',
          className
        )}
        aria-label="Update Portfolio Title"
        value={title}
        disabled={isPending}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
      />
      {isPending && <Loader size={32} />}
    </form>
  )
}
