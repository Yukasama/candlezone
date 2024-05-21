'use client'

import { useRouter } from 'next/navigation'
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
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CreatePortfolioSchema } from '@/lib/validators/portfolio'
import { PLANS } from '@/config/plans'
import { useMutation } from '@tanstack/react-query'
import { createPortfolio as createPortfolioFn } from '@/actions/portfolio/create-portfolio'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'

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

  function onSubmit(data: FieldValues) {
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
          className="h-[340px] f-box cursor-pointer hover:bg-faded border"
          aria-label="Create portfolio"
        >
          <Button
            size="icon"
            className="hover:bg-primary"
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
            className="space-y-6 f-col"
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
                <FormItem className="flex flex-row items-start space-x-3 -space-y-0.5 rounded-md border p-4 bg-background">
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
              <Button
                className="self-end"
                aria-label="Create portfolio"
                isLoading={isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
