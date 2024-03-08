"use client";

import {
  BarChart3,
  Home,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Searchbar from "./searchbar";

export default function Footbar() {
  const pathname = usePathname();
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
    <div className="sticky bottom-0 h-20 w-full border-t bg-background flex md:hidden justify-evenly items-center">
      {footbarConfigStart.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`${
            item.href === pathname && "text-blue-500"
          } hover:text-blue-500 f-col items-center gap-0.5 font-bold`}>
          {item.icon}
          <p className="text-sm">{item.title}</p>
        </Link>
      ))}
      <Searchbar footbar />
      {footbarConfigEnd.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`${
            item.href === pathname && "text-blue-500"
          } hover:text-blue-500 f-col items-center gap-0.5 font-bold`}>
          {item.icon}
          <p className="text-sm">{item.title}</p>
        </Link>
      ))}
    </div>
  );
}
