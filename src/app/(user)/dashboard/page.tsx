import { DashboardSidebar } from '@/features/user/dashboard/dashboard-sidebar';

export const metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <div className="f-col min-h-screen lg:grid lg:grid-cols-3 2xl:grid-cols-4">
      <DashboardSidebar />

      <div className="lg:f-col hidden">Coming soon!</div>
    </div>
  );
}
