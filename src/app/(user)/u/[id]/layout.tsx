import { db } from '@/lib/db';
import { PropsWithChildren } from 'react';

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

export default function UserLayout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
