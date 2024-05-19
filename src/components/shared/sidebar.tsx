'use client'

import Searchbar from './searchbar'
import { Menu } from 'lucide-react'
import { CompanyLogo } from './company-logo'
import { Portfolio, Stock } from '@prisma/client'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Card } from '../ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '../ui/accordion'
import Link from 'next/link'
import { Button } from '../ui/button'
import { User } from 'next-auth'
import { PortfolioItem } from '../portfolio/portfolio-item'
import { UserAvatar } from '../user/user-avatar'
import { siteConfig } from '@/config/site'
import { featuredLinks } from '@/config/content'

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
        <Button size="icon" variant="outline">
          <Menu size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="f-col gap-5 rounded-r-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
                className="flex hover:bg-zinc-100 dark:hover:bg-zinc-900 items-center p-4 gap-3 font-medium h-12 rounded-md"
              >
                <p className="text-sm sm:text-base">{link.title}</p>
              </Link>
            </SheetClose>
          ))}
        </div>

        <div className="f-col justify-between h-full">
          <Accordion type="single" defaultValue="portfolios" collapsible>
            <AccordionItem
              value="portfolios"
              title="Portfolios"
              aria-label="Portfolios"
            >
              <AccordionTrigger>Portfolios</AccordionTrigger>
              <AccordionContent>
                {user ? (
                  <div className="max-h-72 scroll-auto f-col gap-2">
                    {portfolios?.map((portfolio) => (
                      <SheetClose key={portfolio.id} asChild>
                        <Link
                          key={portfolio.id}
                          className="w-full"
                          href={`/p/${portfolio.id}`}
                        >
                          <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900">
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
                      className="text-zinc-500 hover:underline text-center"
                    >
                      Sign in to view portfolios
                    </Link>
                  </SheetClose>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {user && (
            <Link href="/settings">
              <Card className="flex items-center p-2 px-3 gap-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 border">
                <UserAvatar user={user} className="w-10 h-10" />
                <div>
                  <p className="font-medium truncate max-w-[200px]">
                    {user.name}
                  </p>
                  <p className="text-sm text-zinc-400 truncate max-w-[200px]">
                    {user.email}
                  </p>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
