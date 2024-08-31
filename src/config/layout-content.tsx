import {
  Calendar,
  ChartArea,
  ChartNetwork,
  LayoutDashboard,
} from 'lucide-react';

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
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: 'Screener',
    href: '/screener',
    icon: <ChartNetwork size={18} />,
  },
  {
    title: 'Economic Calendar',
    href: '/economic-calendar',
    icon: <Calendar size={18} />,
  },
  {
    title: 'AI Analysis',
    href: '/',
    icon: <ChartArea size={18} />,
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
