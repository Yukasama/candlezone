'use client'

import { updatePortfolio } from '@/actions/portfolio/update-portfolio'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Portfolio } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FocusEvent, FormEvent, HTMLAttributes, useState } from 'react'
import { toast } from 'sonner'
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
    <form className="flex max-w-48 items-center" onSubmit={handleSubmit}>
      <Input
        className={cn(
          'h-8 -translate-x-1.5 cursor-pointer border-none p-0 pl-1.5 text-xl hover:bg-gray-100 dark:hover:bg-gray-900',
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
