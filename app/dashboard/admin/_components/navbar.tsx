"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-[600px] items-center justify-between rounded-xl bg-secondary p-4 shadow-sm">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={
            pathname === "/dashboard/admin/server" ? "default" : "outline"
          }
        >
          <Link href="/dashboard/admin/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={
            pathname === "/dashboard/admin/client" ? "default" : "outline"
          }
        >
          <Link href="/dashboard/admin/client">Client</Link>
        </Button>
        <Button
          asChild
          variant={
            pathname === "/dashboard/admin/admin" ? "default" : "outline"
          }
        >
          <Link href="/dashboard/admin/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={
            pathname === "/dashboard/admin/settings" ? "default" : "outline"
          }
        >
          <Link href="/dashboard/admin/settings">Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
