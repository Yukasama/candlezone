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
    <div className="fixed z-20 bottom-0 h-16 gap-1 w-full border-t bg-background flex md:hidden justify-evenly items-center">
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
