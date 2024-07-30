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

    if (title.length > 21) {
      return toast.warning('Title can be no longer than 20 characters.')
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

    if (title.length > 21) {
      return
    }

    updateTitle({ portfolioId: portfolio.id, title })
  }

  return (
    <form
      className="relative flex max-w-52 items-center md:max-w-60"
      onSubmit={handleSubmit}
    >
      <Input
        className={cn(
          'text-medium bg-faded h-10 -translate-x-1.5 cursor-pointer p-0 pl-1.5 md:text-lg lg:text-xl',
          className,
        )}
        aria-label="Update Portfolio Title"
        value={title}
        disabled={isPending}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
      />
      <div className="absolute right-0.5">
        {isPending && <Loader size={32} />}
      </div>
    </form>
  )
}
