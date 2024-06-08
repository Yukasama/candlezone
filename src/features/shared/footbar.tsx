import { BarChart3, Home, Settings, SlidersHorizontal } from 'lucide-react'
import { Searchbar } from '../../components/searchbar'
import { FootbarLink } from './footbar-link'

export const Footbar = () => {
  const footbarConfigStart = [
    {
      title: 'Home',
      href: '/',
      icon: <Home size={20} />,
    },
    {
      title: 'Portfolio',
      href: '/portfolio',
      icon: <BarChart3 size={20} />,
    },
  ]

  const footbarConfigEnd = [
    {
      title: 'Screener',
      href: '/screener',
      icon: <SlidersHorizontal size={20} />,
    },

    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings size={20} />,
    },
  ]

  return (
    <div className="fixed bottom-0 z-20 flex h-16 w-full items-center justify-evenly gap-1 border-t bg-background md:hidden">
      {footbarConfigStart.map((item) => (
        <FootbarLink key={item.title} {...item} />
      ))}
      <Searchbar footbar />
      {footbarConfigEnd.map((item) => (
        <FootbarLink key={item.title} {...item} />
      ))}
    </div>
  )
}
