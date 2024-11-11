import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (user?.role !== 'ADMIN') {
    return notFound();
  }

  const latestInserts = await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 3,
  });

  return <AdminDashboard latestInserts={latestInserts} />;
}
