import type { PropsWithChildren } from 'react'
import { BackButton } from '@/components/back-button'
import { CompanyLogo } from '@/components/shared/company-logo'

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="fixed f-col xl:grid xl:grid-cols-2 left-0 top-0 z-20 h-screen w-screen bg-background">
      <BackButton />
      <div className="xl:f-col xl:f-box gap-4 hidden">
        <CompanyLogo px={200} />
        <div className="f-col items-center gap-0.5">
          <h2 className="text-3xl font-semibold">Zenathra</h2>
          <p className="text-slate-400">Analyze stocks your way.</p>
        </div>
      </div>
      <div className="f-col f-box mt-16 xl:mt-0">
        <CompanyLogo px={60} className="flex xl:hidden" />
        {children}
      </div>
    </div>
  )
}
