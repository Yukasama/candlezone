import { CompanyLogo } from '@/components/company-logo';
import { CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { footerLinks } from './config/layout-links';

export const Footer = () => {
  return (
    <div className="f-center m-2.5 mx-auto mt-10 w-fit justify-center gap-5 rounded-full bg-accent p-4 px-6 sm:gap-14 md:px-9">
      <div className="f-center gap-3">
        <CompanyLogo />
        <CardTitle className="hidden text-xl sm:flex">
          {siteConfig.name}
        </CardTitle>
      </div>

      <div className="f-center mt-0.5 gap-2 text-[13px] text-gray-400 sm:gap-5">
        <p className="whitespace-nowrap">&copy; 2024 {siteConfig.name}</p>
        {footerLinks.map(({ name, url }) => (
          <Link
            key={name}
            href={url}
            prefetch={false}
            className="hover:underline"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};
