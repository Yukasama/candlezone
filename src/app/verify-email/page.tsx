import { VerifyEmail } from '@/features/auth/verify-email'

export const metadata = { title: 'Verifying...' }

export default function VerifyEmailPage() {
  return (
    <div className="fixed-layout f-box pb-20">
      <VerifyEmail />
    </div>
  )
}
