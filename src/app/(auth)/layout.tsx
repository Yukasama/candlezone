import { CompanyLogo } from '@/components/company-logo';
import { BackButton } from '@/features/auth/back-button';
import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="f-col fixed left-0 top-0 z-20 h-screen w-screen bg-background xl:grid xl:grid-cols-2">
      <BackButton />
      <div className="xl:f-col xl:f-box hidden gap-4">
        <CompanyLogo px={200} />
        <div className="f-col items-center gap-0.5">
          <h2 className="text-3xl font-semibold">Zenathra</h2>
          <p className="text-gray-400">Analyze stocks your way.</p>
        </div>
      </div>
      <div className="f-col f-box mt-16 xl:mt-0">
        <CompanyLogo px={60} className="flex xl:hidden" />
        {children}
      </div>
    </div>
  );
}
