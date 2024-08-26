import { Calendar, ChartArea, ChartNetwork } from 'lucide-react';

export const navLinks = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Portfolios',
    href: '/p/new',
  },
  {
    title: 'Screener',
    href: '/screener',
  },
];

export const featuredLinks = [
  {
    title: 'Screener',
    href: '/screener',
    icon: <ChartNetwork size={18} />,
    description: 'Filter stocks based on your preferred criteria.',
  },
  {
    title: 'Economic Calendar',
    href: '/economic-calendar',
    icon: <Calendar size={18} />,
    description: 'Track key financial events to guide your investment choices.',
  },
  {
    title: 'AI Analysis',
    href: '/',
    icon: <ChartArea size={18} />,
    description:
      'Harness AI-driven insights to analyze market trends and stock performance.',
  },
];

export const footerLinks = [
  {
    name: 'About',
    url: '/about',
  },
  {
    name: 'Privacy',
    url: '/privacy-policy',
  },
  {
    name: 'Terms',
    url: '/terms',
  },
  {
    name: 'Contact',
    url: '/contact',
  },
];
