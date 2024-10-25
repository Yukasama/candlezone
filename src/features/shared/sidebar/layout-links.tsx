import {
  Calendar,
  ChartNetwork,
  CircleDollarSign,
  Home,
  LayoutDashboard,
} from 'lucide-react';

export const featuredLinks = [
  {
    title: 'Home',
    href: '/',
    icon: <Home size={18} />,
  },
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
    title: 'Upcoming Earnings',
    href: '/upcoming-earnings',
    icon: <CircleDollarSign size={18} />,
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
