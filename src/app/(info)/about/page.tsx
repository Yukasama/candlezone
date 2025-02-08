import { CompanyLogo } from '@/components/company-logo';
import { siteConfig } from '@/config/site';

export const metadata = { title: 'About' };

export default function About() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-1">
      <CompanyLogo px={100} className="mb-2" />
      <h1 className="text-3xl font-bold">About Zenathra</h1>
      <p className="text-gray-400">Analyze stocks your way.</p>
      <p className="mt-12 text-gray-400">Built by {siteConfig.creator}.</p>
    </div>
  );
}
