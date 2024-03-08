"use client";

import Searchbar from "./searchbar";
import { Menu } from "lucide-react";
import CompanyLogo from "./company-logo";
import { Portfolio, Stock } from "@prisma/client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Card } from "../ui/card";
import PortfolioImage from "../portfolio/portfolio-image";
import { Accordion, AccordionItem, Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import { FEATURED_LINKS, NAV_LINKS } from "@/config/site";
import { SITE } from "@/config/site";
import { User } from "next-auth";

interface Props {
  user: User | undefined;
  portfolios:
    | Pick<Portfolio, "id" | "title" | "color" | "isPublic">[]
    | undefined;
  recentStocks: Pick<Stock, "symbol" | "companyName" | "image">[] | undefined;
}

export default function Sidebar({ user, portfolios, recentStocks }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button isIconOnly variant="flat" size="sm" aria-label="Open sidebar">
          <Menu size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="f-col gap-5 rounded-r-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CompanyLogo px={35} />
            <p className="text-lg">{SITE.name}</p>
          </div>
        </div>

        <Searchbar
          recentStocks={recentStocks}
          responsive={false}
          className="w-full"
        />

        <div className="f-col gap-2.5">
          {FEATURED_LINKS.map((link) => (
            <SheetClose key={link.title} asChild>
              <Link
                href={link.href}
                className="flex hover:bg-zinc-100 dark:hover:bg-zinc-900 items-center p-4 gap-3 font-medium h-12 rounded-md">
                <p className="text-sm sm:text-base">{link.title}</p>
              </Link>
            </SheetClose>
          ))}
        </div>

        <div className="f-col justify-between h-full">
          <Accordion defaultExpandedKeys={["portfolios"]}>
            <AccordionItem
              key="portfolios"
              aria-label="Portfolios"
              title="Portfolios">
              {user ? (
                <div className="max-h-72 scroll-auto f-col gap-2">
                  {portfolios?.map((portfolio) => (
                    <SheetClose key={portfolio.id} asChild>
                      <Link
                        key={portfolio.id}
                        className="w-full"
                        href={`/p/${portfolio.id}`}>
                        <Card className="flex items-center gap-2.5 p-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                          <PortfolioImage portfolio={portfolio} />
                          <div>
                            <p className="font-medium">{portfolio.title}</p>
                            <p className="text-sm text-start text-zinc-400">
                              {portfolio.isPublic ? "Public" : "Private"}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/sign-in"
                    className="text-zinc-500 hover:underline text-center">
                    Sign in to view portfolios
                  </Link>
                </SheetClose>
              )}
            </AccordionItem>
          </Accordion>

          {user && (
            <Link href="/settings">
              <Card className="flex items-center p-2 px-3 gap-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                <Avatar
                  showFallback
                  isBordered
                  src={user?.image ?? undefined}
                  name={user?.name?.[0].toUpperCase()}
                  size="sm"
                  alt="profile picture"
                />
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
  );
}
