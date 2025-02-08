import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUser } from '@/features/auth/actions/get-user';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { db } from '@/lib/db';
import { User } from 'next-auth';
import Link from 'next/link';

interface Props {
  user: Pick<User, 'id'>;
}

export const PortfolioList = async ({ user }: Readonly<Props>) => {
  const sessionUser = await getUser();
  const profileBelongsToUser = sessionUser?.id === user.id;

  const portfolios = await db.portfolio.findMany({
    include: {
      orders: {
        select: { stockId: true },
      },
    },
    where: {
      userId: user.id,
      ...(profileBelongsToUser ? {} : { isPublic: true }),
    },
  });

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Portfolios</CardTitle>
        <CardDescription>List of all portfolios</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {portfolios.length > 0 ? (
          portfolios.map((portfolio) => (
            <Link key={portfolio.id} href={`/p/${portfolio.id}`}>
              <PortfolioItem
                className="hover:bg-accent rounded-full border bg-gray-50 p-1.5 px-3 dark:bg-gray-900"
                key={portfolio.id}
                portfolio={portfolio}
              />
            </Link>
          ))
        ) : (
          <p className="text-lg text-gray-400">No portfolios created yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
