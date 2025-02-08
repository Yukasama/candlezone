import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUser } from '@/features/auth/actions/get-user';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { PortfolioList } from '@/features/user/u/portfolio-list';
import { RecentStocks } from '@/features/user/u/recent-stocks';
import { db } from '@/lib/db';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return await db.user.findMany({ select: { id: true } });
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const dbUser = await db.user.findUnique({
    select: { name: true },
    where: { id },
  });

  if (!dbUser?.name) {
    return { title: 'User not found' };
  }

  return { title: `${dbUser.name} - User Profile` };
}

export default async function UserPage({ params }: Readonly<Props>) {
  const { id } = await params;

  const [user, dbUser] = await Promise.all([
    getUser(),
    db.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        biography: true,
      },
      where: { id },
    }),
  ]);

  if (!dbUser) {
    return notFound();
  }

  return (
    <>
      <div className="relative">
        <div className="bg-faded h-24 lg:h-40" />
        <UserAvatar
          user={dbUser}
          className="absolute top-12 left-12 h-24 w-24 text-xl lg:top-16 lg:left-20 lg:h-48 lg:w-48 lg:text-5xl"
        />

        <Card className="rounded-t-none border-x-0 px-7 pt-8 lg:pt-0 lg:pr-40 lg:pl-80">
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl font-medium lg:text-3xl">
                  {dbUser.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={20} />
                  Joined on {dbUser.createdAt.toISOString().split('T')[0]}
                </div>
              </div>
              {user?.id === dbUser.id && (
                <Link
                  href="/settings/profile"
                  className={buttonVariants({
                    variant: 'secondary',
                    size: 'sm',
                  })}
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-6 p-6 lg:grid lg:grid-cols-3">
        <Card className="bg-faded border">
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">{dbUser.biography}</p>
          </CardContent>
        </Card>

        <PortfolioList user={{ id }} />
        <RecentStocks />
      </div>
    </>
  );
}
