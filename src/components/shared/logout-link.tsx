"use client";

import { logout } from "@/actions/logout";
import { LogOut } from "lucide-react";

export default function LogoutLink() {
  return (
    <button
      onClick={() => logout()}
      aria-label="Sign Out"
      className="flex w-full items-center h-9 p-1 rounded-md px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900">
      <LogOut size={20} className="mr-2 text-zinc-400" />
      <h2 className="text-[15px]">Sign Out</h2>
    </button>
  );
}
