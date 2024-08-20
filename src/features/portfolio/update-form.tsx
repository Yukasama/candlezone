'use client'

import { updatePortfolio as updatePortfolioFn } from '@/actions/portfolio/update-portfolio'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UpdatePortfolioSchema } from '@/lib/validators/portfolio'
import { zodResolver } from '@hookform/resolvers/zod'
import { Portfolio } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'isPublic' | 'color'>
}

export const UpdateForm = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState(portfolio.title)

  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(UpdatePortfolioSchema),
    defaultValues: {
      title: '',
      isPublic: false,
    },
  })

  const { mutate: updatePortfolio, isPending } = useMutation({
    mutationFn: updatePortfolioFn,
    onError: () => toast.error('Failed to rename portfolio.'),
    onSuccess: () => router.refresh(),
  })

  const onSubmit = () => {
    if (!input) {
      return setInput(portfolio.title)
    }
    if (input === portfolio.title && isPending) {
      return
    }
    if (input.length > 26) {
      return toast.warning('Title can be no longer than 25 characters.')
    }

    updatePortfolio({
      portfolioId: portfolio.id,
      title: input,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="f-col gap-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Choose your title..."
                  aria-label="Choose portfolio title"
                  {...field}
                />
              </FormControl>
              <FormDescription className="p-1 text-sm text-gray-400">
                Choose a name between 1 and 25 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="self-start" isLoading={isPending} onClick={onSubmit}>
          Save
        </Button>
      </form>
    </Form>
  )
}
