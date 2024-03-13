import { BarChart3, Home, Settings, SlidersHorizontal } from "lucide-react";
import Searchbar from "./searchbar";
import { FootbarLink } from "./footbarLink";

export default function Footbar() {
  const footbarConfigStart = [
    {
      title: "Home",
      href: "/",
      icon: <Home size={20} />,
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      icon: <BarChart3 size={20} />,
    },
  ];
  const footbarConfigEnd = [
    {
      title: "Screener",
      href: "/screener",
      icon: <SlidersHorizontal size={20} />,
    },

    {
      title: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="fixed z-20 bottom-0 h-16 gap-1 w-full border-t bg-background flex md:hidden justify-evenly items-center">
      {footbarConfigStart.map((item, i) => (
        <FootbarLink key={i} {...item} />
      ))}
      <Searchbar footbar />
      {footbarConfigEnd.map((item, i) => (
        <FootbarLink key={i} {...item} />
      ))}
    </div>
  );
}
