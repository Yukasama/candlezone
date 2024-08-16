'use client'

import { CompanyLogo } from '@/components/company-logo'
import { PortfolioItem } from '@/components/portfolio/portfolio-item'
import { Searchbar } from '@/components/searchbar'
import { SymbolItem } from '@/components/stock/symbol-item'
import { ThemeToggleSwitch } from '@/components/theme-toggle-switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { UserAvatar } from '@/components/user/user-avatar'
import { featuredLinks } from '@/config/content'
import { siteConfig } from '@/config/site'
import { Portfolio, Stock } from '@prisma/client'
import { Menu, MoreHorizontal, Settings } from 'lucide-react'
import { User } from 'next-auth'
import Link from 'next/link'

interface Props {
  user: User | undefined
  portfolios:
    | Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>[]
    | undefined
  recentStocks: Pick<Stock, 'symbol' | 'companyName' | 'image'>[] | undefined
}

export const Sidebar = ({
  user,
  portfolios,
  recentStocks,
}: Readonly<Props>) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Open sidebar">
          <Menu size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="f-col gap-4 rounded-r-lg">
        <div className="f-center justify-between">
          <div className="f-center gap-3">
            <CompanyLogo px={35} />
            <p className="text-lg">{siteConfig.name}</p>
          </div>
        </div>

        <Searchbar
          recentStocks={recentStocks}
          responsive={false}
          className="w-full"
        />

        <div className="f-col gap-2.5">
          {featuredLinks.map((link) => (
            <SheetClose key={link.title} asChild>
              <Link
                href={link.href}
                className="flex h-12 items-center gap-3 rounded-md border p-4 font-medium hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <p className="text-sm sm:text-base">{link.title}</p>
              </Link>
            </SheetClose>
          ))}
        </div>

        <div className="f-col h-full justify-between">
          <div className="f-col gap-3">
            <Accordion type="single" defaultValue="portfolios" collapsible>
              <AccordionItem value="portfolios" aria-label="Portfolios">
                <AccordionTrigger>Portfolios</AccordionTrigger>
                <AccordionContent>
                  {user ? (
                    <div className="f-col max-h-72 gap-2 scroll-auto">
                      {portfolios?.map((portfolio) => (
                        <SheetClose key={portfolio.id} asChild>
                          <Link
                            key={portfolio.id}
                            className="w-full"
                            href={`/p/${portfolio.id}`}
                          >
                            <Card className="hover:bg-faded border p-1.5 px-3">
                              <PortfolioItem portfolio={portfolio} />
                            </Card>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href="/sign-in"
                        className="text-center text-gray-400 hover:underline"
                      >
                        Sign in to view portfolios
                      </Link>
                    </SheetClose>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" defaultValue="recentStocks" collapsible>
              <AccordionItem value="recentStocks" aria-label="Recent stocks">
                <AccordionTrigger>Recent stocks</AccordionTrigger>
                <AccordionContent>
                  {user ? (
                    <div className="f-col max-h-72 gap-2 scroll-auto">
                      {recentStocks?.map((stock) => (
                        <SheetClose key={stock.symbol} asChild>
                          <Link
                            className="w-full"
                            href={`/stock/${stock.symbol}`}
                          >
                            <Card className="hover:bg-faded border p-1.5 px-3">
                              <SymbolItem stock={stock} />
                            </Card>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href="/sign-in"
                        className="text-center text-gray-400 hover:underline"
                      >
                        Sign in to view recent stocks
                      </Link>
                    </SheetClose>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {user && (
            <Card className="f-center justify-between border p-2 px-3">
              <div className="f-center gap-2.5">
                <UserAvatar user={user} className="h-10 w-10" />
                <div>
                  <p className="max-w-[200px] truncate font-medium">
                    {user.name}
                  </p>
                  <p className="text-purple max-w-[200px] truncate text-sm">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="User settings"
                  >
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="f-center gap-2">
                    Toggle Theme
                    <ThemeToggleSwitch />
                  </DropdownMenuItem>
                  <SheetClose asChild>
                    <Link href="/settings">
                      <DropdownMenuItem className="hover:bg-faded f-center gap-1.5">
                        <Settings size={18} />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                  </SheetClose>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
