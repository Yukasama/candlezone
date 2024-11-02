import { getUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default async function AdminLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const user = await getUser();
  if (user?.role !== 'ADMIN') {
    return notFound();
  }
  return children;
}
