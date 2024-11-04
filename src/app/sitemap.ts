import { siteConfig } from '@/config/site';
import { db } from '@/lib/db';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stocks, portfolios] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true },
      orderBy: { symbol: 'asc' },
    }),
    db.portfolio.findMany({
      select: { id: true },
      where: { isPublic: true },
      orderBy: { title: 'asc' },
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
    ...(stocks
      ? stocks.map(({ symbol }) => ({
          url: `${siteConfig.url}/stocks/${symbol}`,
        }))
      : []),
    ...(portfolios
      ? portfolios.map(({ id }) => ({
          url: `${siteConfig.url}/p/${id}`,
        }))
      : []),
  ];
}
