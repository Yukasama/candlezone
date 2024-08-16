'use client'

import { addOrders as addOrdersFn } from '@/actions/portfolio/order/add-orders'
import { searchStocks } from '@/actions/stock/search-stocks'
import { Loader } from '@/components/loader'
import { SymbolItem } from '@/components/stock/symbol-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PortfolioWithStockIds } from '@/types/portfolio'
import { OrderType, Stock } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { Info, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  portfolio: PortfolioWithStockIds
}

type SearchResult = Pick<Stock, 'id' | 'symbol' | 'companyName' | 'image'>

interface SelectedStock {
  stock: SearchResult
  date: string
  price?: number
  quantity: number
}

export const AddModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SelectedStock[]>([])
  const [portfolioStocks, setPortfolioStocks] = useState(portfolio.orders)

  const router = useRouter()

  const request = debounce(async () => refetch(), 500)
  const debounceRequest = useCallback(() => {
    request()
  }, [request])

  const { data, isFetched, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
    staleTime: 500,
  })

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to add stocks to portfolio.'),
    onSuccess: () => router.refresh(),
  })

  const onSubmit = () => {
    if (selected.length < 1) {
      return toast.info('Please select at least one stock.')
    } else if (selected.length > 50) {
      return toast.warning(`You can only add ${50} stocks at a time.`)
    }

    const orders = selected.map((entry) => ({
      stockId: entry.stock.id,
      type: 'BUY' as OrderType,
      ...entry,
      stock: undefined,
    }))

    addOrders({ portfolioId: portfolio.id, orders })
    setSelected([])
    setOpen(false)
  }

  const addToSelected = (stock: SearchResult) => {
    if (!selected.some((s) => s.stock.id === stock.id)) {
      setSelected([
        ...selected,
        {
          stock,
          date: new Date().toLocaleDateString(),
          quantity: 1,
        },
      ])
    }
  }

  const removeFromSelected = (stock: SearchResult) => {
    setPortfolioStocks(portfolioStocks?.filter((s) => s.stockId !== stock.id))
    setSelected(selected.filter((s) => s.stock.id !== stock.id))
  }

  const updateStockDetails = (
    stockId: string,
    field: keyof Omit<SelectedStock, 'stock'>,
    value: any,
  ) => {
    setSelected(
      selected.map((s) =>
        s.stock.id === stockId ? { ...s, [field]: value } : s,
      ),
    )
  }

  const onOpenChange = (value: boolean) => {
    if (value === false) {
      router.refresh()
    }
    setOpen(value)
    setInput('')
    setSelected([])
  }

  const filteredData = data?.filter(
    (stock) =>
      !portfolioStocks?.some(
        (portfolioStock) => portfolioStock.stockId === stock.id,
      ),
  )

  return (
    <>
      <Button aria-label="Add orders" size="icon" onClick={() => setOpen(true)}>
        <Plus size={18} />
      </Button>

      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput
          onValueChange={(text) => {
            setInput(text)
            debounceRequest()
          }}
          value={input}
          placeholder="Search stocks..."
        />

        <CommandList key={filteredData?.length}>
          {input.length > 0 ? (
            <>
              {!isFetched ? (
                <CommandEmpty className="f-box h-[300px]">
                  <Loader />
                </CommandEmpty>
              ) : !filteredData?.length ? (
                <CommandEmpty className="f-box h-[300px]">
                  <p className="text-sm text-gray-400">
                    No search results found.
                  </p>
                </CommandEmpty>
              ) : (
                <CommandGroup heading="Stocks" className="gap-1">
                  {filteredData
                    .filter((stock) => !stock.isEtf)
                    .map((stock) => {
                      const isSelected =
                        selected.some((s) => s.stock.id === stock.id) ||
                        portfolioStocks?.some((s) => s.stockId === stock.id)

                      return (
                        <CommandItem
                          key={stock.id}
                          onSelect={() => addToSelected(stock)}
                          value={stock.symbol + stock.companyName}
                          className="f-col relative cursor-pointer items-start"
                        >
                          <div className="flex items-start gap-2">
                            <SymbolItem stock={stock} />
                            {isSelected && (
                              <Badge
                                className="mt-[1px] h-5 bg-violet-500 text-white transition-colors hover:bg-destructive"
                                onClick={() => removeFromSelected(stock)}
                              >
                                Remove
                              </Badge>
                            )}
                          </div>
                          {isSelected && (
                            <div className="f-center gap-2 px-2 pt-2">
                              <div>
                                <Label>Date</Label>
                                <Input
                                  type="date"
                                  defaultValue={
                                    new Date().toISOString().split('T')[0]
                                  }
                                  onChange={(e) =>
                                    updateStockDetails(
                                      stock.id,
                                      'date',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <div className="f-center gap-0.5">
                                  <Label>Price</Label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="p-0.5 text-violet-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-sm">
                                          If no price is selected, the current
                                          price will be used.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <Input
                                  type="number"
                                  className="w-32"
                                  placeholder="Custom Price"
                                  onChange={(e) =>
                                    updateStockDetails(
                                      stock.id,
                                      'price',
                                      parseFloat(e.target.value) ?? 1,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  className="w-24"
                                  defaultValue={1}
                                  onChange={(e) =>
                                    updateStockDetails(
                                      stock.id,
                                      'quantity',
                                      parseFloat(e.target.value),
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}
            </>
          ) : (
            <CommandEmpty className="f-box h-[300px]">
              <p className="text-sm text-gray-400">
                Search results will appear here.
              </p>
            </CommandEmpty>
          )}
        </CommandList>
        <div className="flex justify-between border-t p-2 px-3">
          <div className="f-center gap-1">
            {!selected?.length ? (
              <p className="text-sm text-gray-400">
                Stocks you select will appear here.
              </p>
            ) : (
              <div className="flex items-center gap-3">
                {selected
                  .slice(0, selected.length > 4 ? 4 : selected.length)
                  .map((s) => (
                    <div className="relative" key={s.stock.id}>
                      <button
                        className="f-box absolute -right-1.5 -top-0.5 h-4 w-4 rounded-full bg-violet-500 transition-colors hover:bg-destructive"
                        onClick={() => removeFromSelected(s.stock)}
                      >
                        <X size={12} />
                      </button>
                      <Badge>{s.stock.symbol}</Badge>
                    </div>
                  ))}
                {selected.length > 4 && (
                  <div className="relative">
                    <Badge>...+{selected.length - 4}</Badge>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            color="primary"
            className="h-8"
            aria-label="Add new stocks"
            isLoading={isPending}
            onClick={onSubmit}
          >
            Add
          </Button>
        </div>
      </CommandDialog>
    </>
  )
}
