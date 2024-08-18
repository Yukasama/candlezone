'use client'

import { addOrders as addOrdersFn } from '@/actions/portfolio/order/add-orders'
import { SymbolItem } from '@/components/stock/symbol-item'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { OrderInputProps, OrderInputSchema } from '@/lib/validators/portfolio'
import { StockQuote } from '@/types/stock'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderType, PortfolioOrder } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  order: Pick<PortfolioOrder, 'portfolioId' | 'stockId' | 'quantity'>
  stock: StockQuote
}

export const NewOrderModal = ({ order, stock }: Props) => {
  const router = useRouter()
  const form = useForm<OrderInputProps>({
    resolver: zodResolver(OrderInputSchema),
    defaultValues: {
      stockId: order.stockId,
      date: new Date(),
      type: 'BUY' as OrderType,
      quantity: 1,
      price: stock.price,
    },
  })

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: (values: FieldValues) => {
      return addOrdersFn({
        portfolioId: order.portfolioId,
        orders: [
          {
            stockId: order.stockId,
            type: values.type,
            price: values.price,
            quantity: values.quantity,
            date: values.date,
          },
        ],
      })
    },
    onError: () => toast.error('Failed to create order.'),
    onSuccess: () => router.refresh(),
  })

  return (
    <DialogContent className="p-0">
      <SymbolItem
        stock={stock}
        className="bg-faded rounded-t-md border-b p-4"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            () => addOrders(form.getValues()),
            (e) => {
              console.log(e)
            },
          )}
          className="f-col space-y-3 p-6 pt-2"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => <DatePicker field={field} />}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Type</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-start gap-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="f-center gap-1 py-1">
                    Price
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} className="text-violet-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">
                            If no price is selected, the current price will be
                            used.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending}
                      placeholder="Custom Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="pt-3">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" isLoading={isPending}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
