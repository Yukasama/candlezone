import {
  BarChart2,
  ChartNetwork,
  Clock10,
  LayoutDashboard,
} from 'lucide-react';

export const loadPortfolioLinks = (portfolioId: string) => {
  return [
    {
      href: `/p/${portfolioId}`,
      icon: <LayoutDashboard size={18} />,
      title: 'Overview',
    },
    {
      href: `/p/${portfolioId}/performance`,
      icon: <BarChart2 size={18} />,
      title: 'Performance',
    },
    {
      href: `/p/${portfolioId}/analyze`,
      icon: <ChartNetwork size={18} />,
      title: 'Analyze',
    },
    {
      href: `/p/${portfolioId}/order-history`,
      icon: <Clock10 size={18} />,
      title: 'Order History',
    },
  ];
};
