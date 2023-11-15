import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Searchbar from "./searchbar";
import { db } from "@/db";
import { uniqBy } from "lodash";
import CompanyLogo from "./company-logo";
import dynamic from "next/dynamic";
import { UserAccountNav } from "./user-account-nav";
import { AlertTriangle, Menu } from "lucide-react";
import NavbarMenu from "./navbar-menu";
import { Button, buttonVariants } from "../ui/button";
import { getUser } from "@/lib/auth";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => (
    <div className={buttonVariants({ variant: "subtle", size: "xs" })}>
      <Menu className="h-5" />
    </div>
  ),
});

export default async function Navbar() {
  const user = await getUser();
  const dbUser = await db.user.findFirst({
    select: {
      role: true,
      portfolios: {
        select: {
          id: true,
          title: true,
          color: true,
          public: true,
        },
        orderBy: { title: "asc" },
      },
      recentStocks: {
        select: {
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        take: 10,
      },
    },
    where: { id: user?.id },
  });

  const isAdmin = dbUser?.role === "admin";
  const uniqueStocks = uniqBy(dbUser?.recentStocks, "stock.symbol");

  return (
    <div className="f-col">
      <div className="sticky top-0 h-16 z-20 flex w-full items-center justify-between gap-4 p-2 px-6 border-b bg-card/50">
        <div className="flex items-center gap-5 flex-1">
          <Sidebar
            user={user}
            portfolios={dbUser?.portfolios}
            recentStocks={uniqueStocks}
          />
          <Link href="/">
            <CompanyLogo px={30} priority />
          </Link>
          <div className="md:flex hidden">
            <Searchbar recentStocks={uniqueStocks} />
          </div>
        </div>

        <NavbarMenu user={user} />

        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="md:hidden flex">
            <Searchbar recentStocks={uniqueStocks} />
          </div>
          <ThemeToggle />
          {user && <UserAccountNav user={user} isAdmin={isAdmin} />}
          {!user && (
            <Link href="/sign-in">
              <Button className="whitespace-nowrap bg-primary text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="w-full bg-red-500 h-10 f-box gap-2">
        <AlertTriangle className="h-4 w-4" />
        Currently under maintenance
      </div>
    </div>
  );
}
