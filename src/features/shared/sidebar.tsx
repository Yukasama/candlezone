'use client'

import { CompanyLogo } from '@/components/company-logo'
import { PortfolioItem } from '@/components/portfolio/portfolio-item'
import { Searchbar } from '@/components/searchbar'
import { SymbolItem } from '@/components/stock/symbol-item'
import { ThemeToggleSwitch } from '@/components/theme-toggle-switch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { UserAvatar } from '@/components/user/user-avatar'
import { featuredLinks } from '@/config/layout-content'
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

      <SheetContent side="left" className="f-col justify-between rounded-r-lg">
        <div className="f-col gap-4 overflow-auto">
          <div className="f-center gap-3">
            <CompanyLogo px={35} />
            <p className="text-lg">{siteConfig.name}</p>
          </div>

          <Searchbar
            recentStocks={recentStocks}
            responsive={false}
            className="w-full"
          />

          <div className="f-col gap-1">
            {featuredLinks.map((link) => (
              <SheetClose key={link.title} asChild>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 rounded-md p-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  {link.icon}
                  <p className="text-sm sm:text-base">{link.title}</p>
                </Link>
              </SheetClose>
            ))}
          </div>

          <Separator />

          <div className="f-col gap-2">
            <p className="text-md font-medium">Portfolios</p>
            {user ? (
              <div className="f-col max-h-72 gap-2 scroll-auto">
                {portfolios?.map((portfolio) => (
                  <SheetClose key={portfolio.id} asChild>
                    <Link
                      key={portfolio.id}
                      className="w-full"
                      href={`/p/${portfolio.id}`}
                    >
                      <Card className="hover:bg-faded p-1.5">
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
          </div>

          <Separator />

          <div className="f-col gap-2">
            <p className="text-md font-medium">Recent stocks</p>
            {user ? (
              <div className="f-col max-h-72 gap-2 scroll-auto">
                {recentStocks?.map((stock) => (
                  <SheetClose key={stock.symbol} asChild>
                    <Link className="w-full" href={`/stock/${stock.symbol}`}>
                      <Card className="hover:bg-faded p-1.5">
                        <SymbolItem stock={stock} size="sm" />
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
          </div>
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
                <Button size="icon" variant="ghost" aria-label="User settings">
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
      </SheetContent>
    </Sheet>
  )
}
