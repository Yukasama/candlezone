import { ResetPassword } from '@/features/auth/reset-password'

export const metadata = { title: 'Reset Password' }

export default function ResetPasswordPage() {
  return (
    <div className="fixed-layout f-box pb-20">
      <ResetPassword />
    </div>
  )
}
