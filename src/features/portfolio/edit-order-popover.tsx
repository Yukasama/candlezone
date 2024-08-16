'use client'

import { updateOrder as updateOrderFn } from '@/actions/portfolio/order/update-order'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PopoverContent } from '@/components/ui/popover'
import { UpdateOrderSchema } from '@/lib/validators/portfolio'
import { zodResolver } from '@hookform/resolvers/zod'
import { PortfolioOrder } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  order: PortfolioOrder
}

export const EditOrder = ({ order }: Props) => {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: order,
  })

  const { mutate: updateOrder, isPending } = useMutation({
    mutationFn: () => {
      const values = form.getValues()
      const data = {
        order: {
          ...values,
          id: order.id,
          date: values.date.toISOString(),
        },
      }
      return updateOrderFn(data)
    },
    onError: () => toast.error('Failed to add stocks to portfolio.'),
    onSuccess: () => router.refresh(),
  })

  return (
    <PopoverContent className="bg-faded">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => updateOrder())}
          className="f-col space-y-6"
        >
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    disabled={isPending}
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
        </form>
      </Form>
    </PopoverContent>
  )
}
