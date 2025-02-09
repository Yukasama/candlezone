import { CompanyLogo } from '@/components/company-logo';
import { CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { footerLinks } from './config/layout-links';

export const Footer = () => {
  return (
    <div className="bg-faded m-2.5 mx-auto mt-10 flex w-fit items-center justify-center gap-5 rounded-full p-4 px-6 sm:gap-14 md:px-9">
      <div className="flex items-center gap-3">
        <CompanyLogo />
        <CardTitle className="hidden text-xl sm:flex">
          {siteConfig.name}
        </CardTitle>
      </div>

      <div className="mt-0.5 flex items-center gap-2 text-[13px] text-gray-600 sm:gap-5 dark:text-gray-300">
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
