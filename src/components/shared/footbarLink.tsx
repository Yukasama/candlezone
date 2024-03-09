"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function FootbarLink({ title, href, icon }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`${
        href === pathname && "text-primary"
      } hover:text-primary f-col items-center gap-0.5 font-bold`}>
      {icon}
      <p className="text-xs">{title}</p>
    </Link>
  );
}
