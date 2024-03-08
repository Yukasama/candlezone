import Link from "next/link";
import { FOOTER_LINKS, SITE } from "@/config/site";
import CompanyLogo from "./company-logo";
import { Card, CardTitle } from "../ui/card";
import { Icons } from "./icons";

export default function Footer() {
  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900 rounded-none p-6 lg:p-4 px-10 lg:px-20 w-full">
      <div className="f-col lg:flex-row items-center justify-between gap-1">
        {/* Company Info */}
        <div className="flex items-center flex-1 gap-3 mb-3 lg:mb-0">
          <CompanyLogo />
          <CardTitle className="text-xl">{SITE.name}</CardTitle>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center flex-1 gap-5">
          <p className="text-[13px] text-zinc-500">&copy; 2023 {SITE.name}</p>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              prefetch={false}
              className="text-[13px] text-zinc-500 hover:underline">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {Object.entries(SITE.links).map(([name, url]) => (
            <Link
              key={name}
              href={url}
              prefetch={false}
              target="_blank"
              className="f-box h-10 w-10 rounded-md">
              {name === "github" ? (
                <Icons.github className="h-6 dark:invert" />
              ) : name === "instagram" ? (
                <Icons.instagram className="h-6" />
              ) : name === "twitter" ? (
                <Icons.twitter className="h-6" />
              ) : name === "youtube" ? (
                <Icons.youtube className="h-6" />
              ) : (
                name === "linkedin" && <Icons.linkedin className="h-6" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
