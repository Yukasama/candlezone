import { CompanyLogo } from '@/components/company-logo';
import { CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { footerLinks } from '../sidebar/layout-links';

export const Footer = () => {
  return (
    <div className="bg-faded f-center justify-between p-4 pb-20 sm:pb-4 md:px-20">
      <div className="f-center gap-3">
        <CompanyLogo />
        <CardTitle className="hidden text-xl sm:flex">
          {siteConfig.name}
        </CardTitle>
      </div>

      <div className="flex justify-end gap-3 text-[13px] text-gray-400 sm:gap-5">
        &copy; 2024 {siteConfig.name}
        {footerLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            prefetch={false}
            className="hover:underline"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
