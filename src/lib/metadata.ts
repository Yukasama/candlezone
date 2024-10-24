import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export const constructMetadata: () => Metadata = () => {
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      images: [{ url: '/logo.png' }],
    },
    icons: '/favicon.ico',
    metadataBase: new URL(siteConfig.url),
  };
};
