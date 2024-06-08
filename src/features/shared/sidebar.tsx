'use client'

import { Searchbar } from '../../components/searchbar'
import { Menu } from 'lucide-react'
import { CompanyLogo } from '../../components/company-logo'
import { Portfolio, Stock } from '@prisma/client'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '../../components/ui/sheet'
import { Card } from '../../components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '../../components/ui/accordion'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { User } from 'next-auth'
import { PortfolioItem } from '../../components/portfolio/portfolio-item'
import { UserAvatar } from '../../components/user/user-avatar'
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
        <Button size="icon" variant="outline" aria-label="Open sidebar">
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
                className="flex h-12 items-center gap-3 rounded-md p-4 font-medium hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <p className="text-sm sm:text-base">{link.title}</p>
              </Link>
            </SheetClose>
          ))}
        </div>

        <div className="f-col h-full justify-between">
          <Accordion type="single" defaultValue="portfolios" collapsible>
            <AccordionItem
              value="portfolios"
              title="Portfolios"
              aria-label="Portfolios"
            >
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

          {user && (
            <Link href="/settings">
              <Card className="flex items-center gap-2.5 border p-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-900">
                <UserAvatar user={user} className="h-10 w-10" />
                <div>
                  <p className="max-w-[200px] truncate font-medium">
                    {user.name}
                  </p>
                  <p className="text-purple max-w-[200px] truncate text-sm">
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
