import { useState, useEffect } from "react";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideNav } from "@/components/dashboardLayout/side-nav";
import { NavItems } from "@/components/constants/side-nav";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isDashboardPath = usePathname().includes('/dashboard');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    isDashboardPath ? <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="flex items-center justify-center gap-4">
            <MenuIcon />
            <Link
              href={"/"}
              className="flex items-center justify-between gap-2"
            >
              <Image
                src="/logo.png"
                width={30}
                height={30}
                alt="TrendyWapp website logo"
              />
              <h1 className="text-lg font-semibold">WhatsApp Analyzer</h1>
            </Link>
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="px-1 py-6 pt-16">
            <SideNav items={NavItems} setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
    </> : <div className="flex items-center justify-center gap-4">
      <Link
        href={"/"}
        className="flex items-center justify-between gap-2"
      >
        <Image
          src="/logo.png"
          width={30}
          height={30}
          alt="TrendyWapp website logo"
        />
        <h1 className="text-lg font-semibold">WhatsApp Analyzer</h1>
      </Link>
    </div>
  );
};
