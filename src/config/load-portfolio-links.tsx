import {
  BarChart2,
  ChartNetwork,
  Clock10,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

export const loadPortfolioLinks = (portfolioId: string) => {
  return [
    {
      title: 'Overview',
      href: `/p/${portfolioId}`,
      icon: <LayoutDashboard size={18} />,
    },
    {
      title: 'Performance',
      href: `/p/${portfolioId}/performance`,
      icon: <BarChart2 size={18} />,
    },
    {
      title: 'Analyze',
      href: `/p/${portfolioId}/analyze`,
      icon: <ChartNetwork size={18} />,
    },
    {
      title: 'Order History',
      href: `/p/${portfolioId}/order-history`,
      icon: <Clock10 size={18} />,
    },
    {
      title: 'Settings',
      href: `/p/${portfolioId}/settings`,
      icon: <Settings size={18} />,
    },
  ];
};
