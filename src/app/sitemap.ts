import { siteConfig } from '@/config/site';
import { db } from '@/lib/db';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stocks, portfolios] = await Promise.all([
    db.stock.findMany({
      orderBy: { symbol: 'asc' },
      select: { symbol: true },
    }),
    db.portfolio.findMany({
      orderBy: { title: 'asc' },
      select: { id: true },
      where: { NOT: { isPublic: undefined } },
    }),
  ]);

  return [
    { url: `${siteConfig.url}/` },
    { url: `${siteConfig.url}/sign-in` },
    { url: `${siteConfig.url}/sign-up` },
    { url: `${siteConfig.url}/verify-email` },
    { url: `${siteConfig.url}/about` },
    { url: `${siteConfig.url}/contact` },
    { url: `${siteConfig.url}/pricing` },
    { url: `${siteConfig.url}/privacy-policy` },
    { url: `${siteConfig.url}/terms` },
    { url: `${siteConfig.url}/economic-calendar` },
    { url: `${siteConfig.url}/upcoming-earnings` },
    { url: `${siteConfig.url}/screener` },
    { url: `${siteConfig.url}/dashboard` },
    ...stocks.map(({ symbol }) => ({
      url: `${siteConfig.url}/stocks/${symbol}`,
    })),
    ...portfolios.map(({ id }) => ({
      url: `${siteConfig.url}/p/${id}`,
    })),
  ];
}
