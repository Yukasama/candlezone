import { ExternalLink, EyeOff } from "lucide-react";
import { type PropsWithChildren } from "react";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import PortfolioImage from "@/components/portfolio/portfolio-image";
import { Button, Spinner } from "@nextui-org/react";
import PortfolioNavigation from "./portfolio-navigation";
import PageLayout from "@/components/shared/page-layout";

const ChangeTitle = dynamic(
  () => import("@/app/(portfolio)/p/[id]/change-title"),
  {
    ssr: false,
    loading: () => <Spinner size="sm" />,
  }
);

const EditVisibility = dynamic(
  () => import("@/components/portfolio/edit-visibility"),
  {
    ssr: false,
    loading: () => (
      <Button
        size="sm"
        isIconOnly
        isLoading
        className="bg-blue-500 text-white"
      />
    ),
  }
);

const PortfolioAddModal = dynamic(
  () => import("@/components/portfolio/portfolio-add-modal"),
  {
    ssr: false,
    loading: () => <Button size="sm" color="primary" isIconOnly isLoading />,
  }
);

const PortfolioDeleteModal = dynamic(
  () => import("@/components/portfolio/portfolio-delete-modal"),
  {
    ssr: false,
    loading: () => (
      <Button size="sm" className="bg-red-500" isIconOnly isLoading />
    ),
  }
);

interface Props extends PropsWithChildren {
  params: { id: string };
}

export async function generateStaticParams() {
  const data = await db.portfolio.findMany({
    select: { id: true },
  });

  return data.map((portfolio) => ({ id: portfolio.id }));
}

export async function generateMetadata({ params: { id } }: Props) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      title: true,
      isPublic: true,
      userId: true,
    },
    where: { id },
  });

  if (!portfolio) {
    return { title: "Portfolio not found" };
  }

  const user = await getUser();

  // Portfolio is private and it does not belong to the user
  if (!portfolio.isPublic && user?.id !== portfolio.userId) {
    return { title: "This portfolio is private" };
  }

  return { title: portfolio.title };
}

export default async function Layout({ children, params: { id } }: Props) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
      userId: true,
      createdAt: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { id },
  });

  if (!portfolio) {
    return notFound();
  }

  const user = await getUser();

  // Portfolio is private and it does not belong to the user
  if (!portfolio.isPublic && user?.id !== portfolio.userId) {
    return (
      <div className="f-box f-col mt-[376px] gap-3">
        <div className="p-5 mb-0.5 rounded-full w-20 h-12 f-box bg-primary">
          <EyeOff size={24} />
        </div>
        <h2 className="text-xl font-medium">This Portfolio is private.</h2>
        <Link
          href="/"
          className="text-zinc-400 flex items-center gap-2 hover:underline">
          Back to homepage
          <ExternalLink size={18} />
        </Link>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PortfolioImage portfolio={portfolio} px={50} />
          <div className="f-col gap-0.5">
            <h3 className="text-xl">
              {user?.id === portfolio.userId ? (
                <ChangeTitle portfolio={portfolio} />
              ) : (
                portfolio.title
              )}
            </h3>
            <p className="text-zinc-400 text-sm ml-[5px]">
              Created on{" "}
              {portfolio.createdAt.toISOString().split(".")[0].split("T")[0]}
            </p>
          </div>
        </div>

        {/* Actions */}
        {user?.id === portfolio.userId && (
          <div className="flex items-center gap-3">
            <EditVisibility portfolio={portfolio} />
            <PortfolioAddModal portfolio={portfolio} />
            <PortfolioDeleteModal portfolio={portfolio} />
          </div>
        )}
      </div>

      <PortfolioNavigation portfolioId={portfolio.id} />
      <Separator />

      {/* Dashboard */}
      {portfolio.stocks.length ? (
        children
      ) : (
        <div className="f-box f-col gap-3 mt-80">
          <h2 className="font-medium text-lg">
            There are no stocks in this portfolio.
          </h2>
          {user?.id === portfolio.userId && (
            <PortfolioAddModal portfolio={portfolio} />
          )}
        </div>
      )}
    </PageLayout>
  );
}
