import { BarChart3, Home, Settings, SlidersHorizontal } from "lucide-react";
import Searchbar from "./searchbar";
import { FootbarLink } from "./footbarLink";

export default function Footbar() {
  const footbarConfigStart = [
    {
      title: "Home",
      href: "/",
      icon: <Home />,
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      icon: <BarChart3 />,
    },
  ];
  const footbarConfigEnd = [
    {
      title: "Screener",
      href: "/screener",
      icon: <SlidersHorizontal />,
    },

    {
      title: "Settings",
      href: "/settings",
      icon: <Settings />,
    },
  ];

  return (
    <div className="fixed bottom-0 h-20 w-full border-t bg-background flex md:hidden justify-evenly items-center">
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
