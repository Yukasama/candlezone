import { siteConfig } from '@/config/site';

export const constructMetadata = () => {
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
