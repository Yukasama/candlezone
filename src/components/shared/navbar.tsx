import Link from "next/link";
import Searchbar from "./searchbar";
import { db } from "@/lib/db";
import { CompanyLogo } from "./company-logo";
import dynamic from "next/dynamic";
import { UserAccountNav } from "./user-account-nav";
import NavbarMenu from "./navbar-menu";
import { getUser } from "@/lib/auth";
import { Menu, Moon, AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => (
    <Button size="icon" disabled>
      <Menu size={18} />
    </Button>
  ),
});

const ThemeToggle = dynamic(() => import("./theme-toggle"), {
  ssr: false,
  loading: () => (
    <Button size="icon" disabled>
      <Moon size={18} />
    </Button>
  ),
});

export default async function Navbar() {
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    select: {
      portfolios: {
        select: {
          id: true,
          title: true,
          color: true,
          isPublic: true,
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
        distinct: "stockId",
        take: 5,
      },
    },
    where: { id: user?.id },
  });

  const transformedRecentStocks = dbUser?.recentStocks.map(
    (item: any) => item.stock
  );

  return (
    <div className="sticky top-0 h-16 z-20 flex w-full items-center justify-between gap-4 p-2 px-6 border-b bg-background/70 backdrop:blur">
      <div className="flex items-center gap-5 flex-1">
        <Sidebar
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={transformedRecentStocks}
        />
        <Link href="/">
          <CompanyLogo />
        </Link>
        <div className="md:flex hidden">
          <Searchbar recentStocks={transformedRecentStocks} />
        </div>
      </div>
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

      <NavbarMenu />
        <NavbarMenu user={user} />

      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="md:hidden flex">
          <Searchbar recentStocks={transformedRecentStocks} hotkey />
        </div>

        <ThemeToggle />

        {user ? (
          <UserAccountNav user={user} isAdmin={user?.role === "ADMIN"} />
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({ size: "sm", variant: "secondary" })}
            aria-label="Sign In">
            Sign In
          </Link>
        )}
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
