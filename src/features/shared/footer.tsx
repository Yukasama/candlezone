import { CompanyLogo } from '@/components/company-logo';
import { CardTitle } from '@/components/ui/card';
import { footerLinks } from '@/config/layout-content';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className="bg-faded f-col items-center justify-between gap-2 px-10 pb-24 pt-6 md:p-6 xl:flex-row xl:p-4 xl:px-20">
      <div className="f-center gap-3">
        <CompanyLogo />
        <CardTitle className="text-xl">{siteConfig.name}</CardTitle>
      </div>

      <div className="flex justify-end gap-5 text-[13px] text-gray-400">
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
