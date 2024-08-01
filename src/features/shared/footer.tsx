import { CompanyLogo } from '@/components/company-logo'
import { Icons } from '@/components/icons'
import { Card, CardTitle } from '@/components/ui/card'
import { footerLinks } from '@/config/content'
import { siteConfig } from '@/config/site'
import Link from 'next/link'

export const Footer = () => {
  return (
    <Card className="w-full rounded-none bg-gray-50 px-10 pb-24 pt-6 dark:bg-gray-900 md:p-6 lg:p-4 lg:px-20">
      <div className="f-col items-center justify-between gap-1 lg:flex-row">
        {/* Company Info */}
        <div className="mb-3 flex flex-1 items-center gap-3 lg:mb-0">
          <CompanyLogo />
          <CardTitle className="text-xl">{siteConfig.name}</CardTitle>
        </div>

        {/* Footer Links */}
        <div className="flex flex-1 items-center justify-center gap-5">
          <p className="text-[13px] text-gray-400">
            &copy; 2024 {siteConfig.name}
          </p>
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              prefetch={false}
              className="text-[13px] text-gray-400 hover:underline"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {Object.entries(siteConfig.links).map(([name, url]) => (
            <Link
              key={name}
              href={url}
              prefetch={false}
              target="_blank"
              aria-label={`${name} Social Link`}
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
