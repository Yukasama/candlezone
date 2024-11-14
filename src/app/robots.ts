import { env } from '@/env.mjs';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: new URL('/sitemap.xml', env.NEXT_PUBLIC_HOST_URL).href,
  };
}
