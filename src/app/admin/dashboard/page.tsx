import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { db } from '@/lib/db';

export const metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
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
