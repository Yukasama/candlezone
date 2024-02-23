import { SITE } from "@/config/site";
import { db } from "@/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stocks, portfolios] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true },
      orderBy: { symbol: "asc" },
    }),
    db.portfolio.findMany({
      select: { id: true },
      where: { isPublic: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return [
    {
      url: `${SITE.url}/`,
    },
    {
      url: `${SITE.url}/sign-in/`,
    },
    {
      url: `${SITE.url}/sign-up/`,
    },
    {
      url: `${SITE.url}/verify-email/`,
    },
    {
      url: `${SITE.url}/about/`,
    },
    {
      url: `${SITE.url}/contact/`,
    },
    {
      url: `${SITE.url}/pricing/`,
    },
    {
      url: `${SITE.url}/privacy-policy/`,
    },
    {
      url: `${SITE.url}/terms/`,
    },
    {
      url: `${SITE.url}/economic-calendar`,
    },
    {
      url: `${SITE.url}/screener`,
    },
    {
      url: `${SITE.url}/dashboard`,
    },
    ...(stocks
      ? stocks.map((stock) => ({
          url: `${SITE.url}/stocks/${stock.symbol}`,
        }))
      : []),
    ...(portfolios
      ? portfolios.map((portfolio) => ({
          url: `${SITE.url}/p/${portfolio.id}`,
        }))
      : []),
  ];
}
