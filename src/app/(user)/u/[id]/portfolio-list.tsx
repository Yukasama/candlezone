import { db } from "@/lib/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { User } from "next-auth";
import { PortfolioItem } from "./portfolio-item";

interface Props {
  user: Pick<User, "id">;
}

export default async function PortfolioList({ user }: Props) {
  const sessionUser = await getUser();
  const profileBelongsToUser = sessionUser?.id === user.id;

  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
      createdAt: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: {
      userId: user.id,
      ...(profileBelongsToUser ? {} : { isPublic: true }),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolios</CardTitle>
        <CardDescription>List of all portfolios</CardDescription>
      </CardHeader>

      <CardContent className="f-col gap-2">
        {portfolios.length ? (
          portfolios.map((portfolio) => (
            <PortfolioItem key={portfolio.id} portfolio={portfolio} />
          ))
        ) : (
          <p className="text-lg text-zinc-400">No portfolios created yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
