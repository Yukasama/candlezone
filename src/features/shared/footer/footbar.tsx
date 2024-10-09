import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { BarChart3, Home, Settings, SlidersHorizontal } from 'lucide-react';
import { SettingsModal } from '../../settings/settings-modal';
import { FootbarLink } from './footbar-link';

export const Footbar = () => {
  const footbarConfigStart = [
    {
      title: 'Home',
      href: '/',
      icon: <Home size={18} />,
    },
    {
      title: 'Portfolio',
      href: '/p/new',
      icon: <BarChart3 size={18} />,
    },
  ];

  const footbarConfigEnd = [
    {
      title: 'Screener',
      href: '/screener',
      icon: <SlidersHorizontal size={18} />,
    },
  ];

  return (
    <div className="f-center fixed bottom-0 z-20 h-14 w-full justify-evenly gap-1 border-t bg-faded sm:hidden">
      {footbarConfigStart.map((item) => (
        <FootbarLink key={item.title} {...item} />
      ))}
      {footbarConfigEnd.map((item) => (
        <FootbarLink key={item.title} {...item} />
      ))}
      <Dialog>
        <DialogTrigger
          className={cn(
            'f-col w-16 items-center gap-0.5 rounded-md p-1.5 font-bold hover:bg-accent hover:text-primary',
          )}
        >
          <Settings size={18} />
          <p className="text-xs">Settings</p>
        </DialogTrigger>
        <SettingsModal />
      </Dialog>
    </div>
  );
};
