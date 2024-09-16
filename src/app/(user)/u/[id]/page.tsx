import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { SettingsModal } from '@/features/settings/settings-modal';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { PortfolioList } from '@/features/user/u/portfolio-list';
import { RecentStocks } from '@/features/user/u/recent-stocks';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({ id: user.id }));
}

export async function generateMetadata({ params: { id } }: Props) {
  const dbUser = await db.user.findFirst({
    select: { name: true },
    where: { id },
  });

  if (!dbUser) {
    return { title: 'User not found' };
  }

  return {
    title: `${dbUser.name} - User Profile`,
  };
}

export default async function UserPage({ params: { id } }: Readonly<Props>) {
  const user = await getUser();
  const dbUser = await db.user.findFirst({
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      biography: true,
    },
    where: { id },
  });

  if (!dbUser) {
    return notFound();
  }

  return (
    <>
      <div className="relative">
        <div className="bg-faded h-24 lg:h-40" />
        <UserAvatar
          user={dbUser}
          className="absolute left-12 top-12 h-24 w-24 text-xl lg:left-20 lg:top-16 lg:h-48 lg:w-48 lg:text-5xl"
        />

        <Card className="rounded-t-none border-x-0 px-7 pt-8 lg:pl-80 lg:pr-40 lg:pt-0">
          <CardHeader>
            <div className="flex justify-between">
              <div className="f-col gap-1">
                <CardTitle className="text-2xl font-medium lg:text-3xl">
                  {dbUser?.name}
                </CardTitle>
                <div className="f-center gap-2 text-gray-400">
                  <Calendar size={20} />
                  Joined on {dbUser?.createdAt.toISOString().split('T')[0]}
                </div>
              </div>
              {user?.id === dbUser?.id && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <SettingsModal user={dbUser} />
                </Dialog>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="f-col gap-6 p-6 lg:grid lg:grid-cols-3">
        <Card className="bg-faded border">
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">{dbUser?.biography}</p>
          </CardContent>
        </Card>
        <Suspense
          fallback={
            <Card className="f-box border">
              <Loader />
            </Card>
          }
        >
          <PortfolioList user={{ id }} />
        </Suspense>
        <Suspense
          fallback={
            <Card className="f-box border">
              <Loader />
            </Card>
          }
        >
          <RecentStocks user={{ id }} />
        </Suspense>
      </div>
    </>
  );
}
