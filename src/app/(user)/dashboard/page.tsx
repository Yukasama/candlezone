import { DashboardSidebar } from '@/features/user/dashboard/dashboard-sidebar'

export const metadata = { title: 'Dashboard' }

export default async function Dashboard() {
  return (
    <div className="f-col min-h-screen min-w-[500px] grid-cols-5 lg:grid">
      <div className="f-col gap-8 bg-gray-200/40 p-8 dark:bg-gray-800/30">
        <DashboardSidebar />
      </div>

      <div className="lg:f-col hidden">Coming soon!</div>
    </div>
  )
}
