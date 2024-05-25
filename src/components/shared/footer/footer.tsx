import Link from 'next/link'
import { CompanyLogo } from '../company-logo'
import { Card, CardTitle } from '../../ui/card'
import { Icons } from '../icons'
import { siteConfig } from '@/config/site'
import { footerLinks } from '@/config/content'

export const Footer = () => {
  return (
    <Card className="bg-gray-50 dark:bg-gray-900 rounded-none pb-24 pt-6 md:p-6 lg:p-4 px-10 lg:px-20 w-full">
      <div className="f-col lg:flex-row items-center justify-between gap-1">
        {/* Company Info */}
        <div className="flex items-center flex-1 gap-3 mb-3 lg:mb-0">
          <CompanyLogo />
          <CardTitle className="text-xl">{siteConfig.name}</CardTitle>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center flex-1 gap-5">
          <p className="text-[13px] text-gray-500">
            &copy; 2024 {siteConfig.name}
          </p>
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              prefetch={false}
              className="text-[13px] text-gray-500 hover:underline"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {Object.entries(siteConfig.links).map(([name, url]) => (
            <Link
              key={name}
              href={url}
              prefetch={false}
              target="_blank"
              className="f-box h-10 w-10 rounded-md"
            >
              {name === 'github' ? (
                <Icons.Github className="h-6 dark:invert" />
              ) : name === 'instagram' ? (
                <Icons.Instagram className="h-6" />
              ) : name === 'twitter' ? (
                <Icons.Twitter className="h-6" />
              ) : name === 'youtube' ? (
                <Icons.Youtube className="h-6" />
              ) : (
                name === 'linkedin' && <Icons.LinkedIn className="h-6" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )
}
