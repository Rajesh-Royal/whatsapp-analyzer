"use client";
import { ThemeToggle } from "@/components/dashboardLayout/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/dashboardLayout/mobile-sidebar";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { UserNav } from "@/components/dashboardLayout/user-nav";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoginButton } from "../auth/login-button";
import Image from "next/image";

export default function Header() {
  const { data: sessionData } = useSession();
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          href={"/"}
          className="hidden items-center justify-between gap-2 md:flex"
        >
          <Image
            src="/logo.png"
            width={50}
            height={50}
            alt="TrendyWapp website logo"
          />
          <h1 className="text-lg font-semibold">WhatsApp Analyzer</h1>
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {sessionData?.user ? (
            <UserNav user={sessionData.user} />
          ) : (
            <LoginButton mode="modal">
              <Button size="sm">Sign In</Button>
            </LoginButton>
          )}
        </div>
      </nav>
    </div>
  );
}
