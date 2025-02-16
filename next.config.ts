import type { NextConfig } from 'next';
// import withPWAInit from '@ducanh2912/next-pwa';

// const withPWA = withPWAInit({
//   aggressiveFrontEndNavCaching: true,
//   cacheOnFrontEndNav: true,
//   dest: 'public',
// });

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    ppr: true,
    reactCompiler: true,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  headers: async () => [
    {
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: 'https://zenathra.com',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
      source: '/(.*)',
    },
  ],
  images: {
    remotePatterns: [
      {
        hostname: 'financialmodelingprep.com',
        pathname: '/image-stock/**',
        protocol: 'https',
      },
      {
        hostname: 'images.financialmodelingprep.com',
        protocol: 'https',
      },
      {
        hostname: 'purecatamphetamine.github.io/country-flag-icons/3x2',
        protocol: 'http',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'scontent-frt3-2.xx.fbcdn.net',
        protocol: 'https',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  redirects: async () => [
    {
      destination: 'https://wyld.zenathra.com/allesgutezumgeburtstagsam',
      permanent: true,
      source: '/allesgutezumgeburtstagsam',
    },
    {
      destination: '/settings/profile',
      permanent: true,
      source: '/settings',
    },
  ],
  serverExternalPackages: ['bcrypt', 'pino', 'pino-pretty'],
};

export default nextConfig;
