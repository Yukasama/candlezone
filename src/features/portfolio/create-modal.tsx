'use client'

import { createPortfolio as createPortfolioFn } from '@/actions/portfolio/create-portfolio'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { PLANS } from '@/config/plans'
import {
  CreatePortfolioProps,
  CreatePortfolioSchema,
} from '@/lib/validators/portfolio'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  numberOfPortfolios?: number
}

export const PortfolioCreateCard = ({
  numberOfPortfolios = 0,
}: Readonly<Props>) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
    defaultValues: {
      title: '',
      isPublic: false,
    },
  })

  const { mutate: createPortfolio, isPending } = useMutation({
    mutationFn: createPortfolioFn,
    onError: () => toast.error('Failed to create portfolio.'),
    onSuccess: () => router.refresh(),
  })

  function onSubmit(data: CreatePortfolioProps) {
    if (numberOfPortfolios >= PLANS[0].maxPortfolios) {
      return toast.warning('Maximum number of portfolios reached.')
    }

    createPortfolio({
      title: data.title,
      isPublic: data.isPublic,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className="f-box hover:bg-faded h-[340px] cursor-pointer border"
          aria-label="Create portfolio"
        >
          <Button
            size="icon"
            className="hover:bg-primary"
            aria-label="Create portfolio"
            isLoading={isPending}
          >
            {!isPending && <Plus size={18} />}
          </Button>
        </Card>
      </DialogTrigger>

      <DialogContent className="bg-faded">
        <DialogHeader>
          <DialogTitle>Create Portfolio</DialogTitle>
          <DialogDescription>
            Create a personal portfolio to track your stocks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="f-col space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Title</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Choose your title..."
                      aria-label="Choose portfolio title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is what your portfolio will be called.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start -space-y-0.5 space-x-3 rounded-md border bg-background p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5 leading-none">
                    <FormLabel>Make public</FormLabel>
                    <FormDescription>
                      Display portfolio publicly?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" aria-label="Cancel">
                  Cancel
                </Button>
              </DialogClose>
              <Button className="self-end" isLoading={isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
