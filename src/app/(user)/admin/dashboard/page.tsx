import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { getUser } from '@/features/auth/actions/get-user';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (user?.role !== 'ADMIN') {
    return notFound();
  }

  const latestInserts = await db.stock.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      companyName: true,
      image: true,
      symbol: true,
      updatedAt: true,
    },
    take: 3,
  });

  return <AdminDashboard latestInserts={latestInserts} />;
}
