import { env } from '@/env.mjs';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      disallow: '/private/',
      userAgent: '*',
    },
    sitemap: new URL('/sitemap.xml', env.NEXT_PUBLIC_HOST_URL).href,
  };
}
