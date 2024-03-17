import Link from "next/link";
import Searchbar from "./searchbar";
import { db } from "@/lib/db";
import CompanyLogo from "./company-logo";
import dynamic from "next/dynamic";
import { UserAccountNav } from "./user-account-nav";
import NavbarMenu from "./navbar-menu";
import { Button } from "@nextui-org/react";
import { getUser } from "@/lib/auth";
import { Menu, Moon } from "lucide-react";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => (
    <Button
      isIconOnly
      variant="flat"
      size="sm"
      disabled
      startContent={<Menu size={18} />}
    />
  ),
});

const ThemeToggle = dynamic(() => import("./theme-toggle"), {
  ssr: false,
  loading: () => (
    <Button
      isIconOnly
      variant="flat"
      size="sm"
      disabled
      startContent={<Moon size={18} />}
    />
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
    (item) => item.stock
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

      <NavbarMenu />

      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="md:hidden flex">
          <Searchbar recentStocks={transformedRecentStocks} hotkey />
        </div>

        <ThemeToggle />

        {user ? (
          <UserAccountNav user={user} isAdmin={user?.role === "ADMIN"} />
        ) : (
          <Button as={Link} href="/sign-in" aria-label="Sign In">
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
