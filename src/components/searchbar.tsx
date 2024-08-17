'use client'

import { getClientUser } from '@/actions/auth/get-user'
import { searchStocks } from '@/actions/stock/search-stocks'
import { cn } from '@/lib/utils'
import { Stock } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { Loader } from './loader'
import { SymbolItem } from './stock/symbol-item'
import { Button } from './ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'

interface Props extends HTMLAttributes<HTMLDivElement> {
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[]
  responsive?: boolean
  hotkey?: boolean
}

export const Searchbar = ({
  recentStocks = [],
  responsive = true,
  hotkey = false,
  className,
}: Readonly<Props>) => {
  const [input, setInput] = useState('')
  const [isMac, setIsMac] = useState(false)
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen((prev) => (prev === open ? !open : open))

  const { data: user } = useQuery({
    queryFn: getClientUser,
    queryKey: ['get-user'],
  })

  const pathname = usePathname()

  const request = debounce(async () => refetch(), 300)
  const debounceRequest = useCallback(() => {
    request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey) && hotkey) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [hotkey])

  useEffect(() => {
    setOpen(false)
    setInput('')
  }, [pathname])

  useEffect(() => {
    setIsMac(navigator.userAgent.toUpperCase().includes('MAC'))
  }, [])

  const { isFetching, data, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
  })

  return (
    <>
      <Button
        variant="faded"
        aria-label="Search stocks"
        className={cn(
          'w-60 items-center justify-between p-2 px-3',
          responsive ? 'hidden md:flex' : 'flex',
          className,
        )}
        onClick={toggleOpen}
      >
        <div className="f-center gap-2">
          <Search size={18} className="text-gray-400" />
          <p>Search stocks...</p>
        </div>
        <kbd className="text-purple pointer-events-none inline-flex h-5 select-none items-center gap-[3px] rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <p className={cn('mt-[1px]', !isMac && 'text-[10px]')}>
            {isMac ? '⌘' : 'Strg'}
          </p>
          K
        </kbd>
      </Button>

      {responsive && (
        <Button
          onClick={toggleOpen}
          size="icon"
          variant="outline"
          aria-label="Search stocks"
          className="md:hidden"
        >
          <Search size={18} />
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          onValueChange={(text) => {
            setInput(text)
            debounceRequest()
          }}
          value={input}
          className="h-9 outline-none"
          placeholder="Search stocks..."
        />

        <CommandList key={data?.length} className="f-col gap-1">
          {input.length === 0 ? (
            <>
              {user && (recentStocks?.length ?? 0) > 0 && (
                <CommandGroup heading="Recently Viewed">
                  {recentStocks?.map((stock) => (
                    <Link
                      key={'recentlyviewed' + stock.symbol}
                      href={`/stocks/${stock.symbol}`}
                    >
                      <CommandItem value={stock.symbol + stock.companyName}>
                        <SymbolItem stock={stock} size="sm" />
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              )}
            </>
          ) : (
            <>
              {isFetching ? (
                <CommandEmpty className="f-box">
                  <Loader />
                </CommandEmpty>
              ) : !data?.length ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                <CommandGroup heading="Stocks">
                  {data.map((stock) => (
                    <Link
                      key={'search-command' + stock.symbol}
                      href={`/stocks/${stock.symbol}`}
                    >
                      <CommandItem value={stock.symbol + stock.companyName}>
                        <SymbolItem stock={stock} size="sm" />
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
