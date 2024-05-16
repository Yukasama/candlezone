import { PageLayout } from '@/components/shared/page-layout'
import { AdminDashboard } from '../../../components/admin/admin-dashboard'

export const metadata = { title: 'Admin Dashboard' }

export default function AdminDashboardPage() {
  return (
    <PageLayout>
      <AdminDashboard />
    </PageLayout>
  )
}
