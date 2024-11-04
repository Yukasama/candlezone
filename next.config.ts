import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino'],
  experimental: {
    after: true,
    ppr: 'incremental',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'financialmodelingprep.com',
        pathname: '/image-stock/**',
      },
      {
        protocol: 'https',
        hostname: 'images.financialmodelingprep.com',
      },
      {
        protocol: 'http',
        hostname: 'purecatamphetamine.github.io/country-flag-icons/3x2',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent-frt3-2.xx.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://va.vercel-scripts.com https://static.cloudflareinsights.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://lh3.googleusercontent.com https://scontent-frt3-2.xx.fbcdn.net https://avatars.githubusercontent.com https://financialmodelingprep.com http://purecatamphetamine.github.io;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replaceAll('\n', ''),
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
